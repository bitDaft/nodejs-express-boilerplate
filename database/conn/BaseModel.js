import path from 'path';
import fs from 'fs';
import { Model, compose } from 'objection';
import softDelete from 'objection-soft-delete';

import { __dirname } from '#lib/getFileDir';
import { jsonLoaderSync } from '#lib/jsonLoader';
import config from '#config';
import { knexI } from '#conns';

const jsonSchemasCache = {};
const returningCache = {};

const mixins = compose(
  softDelete({ columnName: 'is_deleted', deletedValue: true, notDeletedValue: false })
);
let knexKeys = Object.keys(knexI);
if (knexKeys.length === 1) Model.knex(knexI[knexKeys[0]]);

export default class BaseModel extends mixins(Model) {
  static concurrency = 10;
  static useLimitInFirst = true;
  static uidProp = 'uid';

  static get jsonSchema() {
    const filename = this.name[0].toLowerCase() + this.name.slice(1);
    if (!jsonSchemasCache.hasOwnProperty(filename)) {
      const filepath = path.join(__dirname(import.meta), '../schema', filename + '.json');
      if (!fs.existsSync(filepath)) {
        console.warn(
          `Schema file for model '${this.name}' missing. It is recommended to create a JSON schema file for it at '${filepath}'`
        );
        jsonSchemasCache[filename] = null;
      } else {
        jsonSchemasCache[filename] = jsonLoaderSync(filepath);
      }
    }
    return jsonSchemasCache[filename];
  }

  $beforeValidate(jsonSchema, json, opt) {
    // # Converting datetime to iso string for schema validation
    for (let propertyName in jsonSchema.properties) {
      let schema = jsonSchema.properties[propertyName];
      if (schema && schema.format === 'date-time') {
        const valueToValidate = json[propertyName];
        if (valueToValidate?.getTime?.()) {
          json[propertyName] = valueToValidate.toISOString();
        }
      }
    }
    return jsonSchema;
  }

  static async beforeInsert({ inputItems }) {
    // # Removing datetime iso string tz info, use this fn if field in DB is DATETIME and not TIMESTAMP
    for (let item of inputItems) {
      for (let key in item) {
        if (
          typeof item[key] === 'string' &&
          item[key].indexOf('T') === 10 &&
          new Date(item[key]).getTime()
        ) {
          item[key] = new Date(item[key]).toISOString().slice(0, 19);
        }
      }
    }
  }

  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.created_at = new Date();
  }

  static async beforeUpdate({ inputItems }) {
    // # Removing datetime iso string tz info, use this fn if field in DB is DATETIME and not TIMESTAMP
    for (let item of inputItems) {
      for (let key in item) {
        if (
          typeof item[key] === 'string' &&
          item[key].indexOf('T') === 10 &&
          new Date(item[key]).getTime()
        ) {
          item[key] = new Date(item[key]).toISOString().slice(0, 19);
        }
      }
    }
  }

  async $beforeUpdate(context) {
    await super.$beforeUpdate(context);
    if (context.softDelete) {
    } else if (context.undelete) {
    } else {
      this.updated_at = new Date();
    }
  }

  static query(...args) {
    if (args[0]) this.knex(args[0]);
    return super.query(...args);
  }

  static get QueryBuilder() {
    let supportsReturning = returningCache[this.knex().context.userParams.client];
    if (!supportsReturning) {
      supportsReturning = returningCache[this.knex().context.userParams.client] = [
        'pg',
        'mssql',
      ].includes(this.knex().context.userParams.client);
    }
    // # Wrapping some fns to use returning if it supports it
    return class extends Model.QueryBuilder {
      insertAndFetch(body) {
        return supportsReturning
          ? Array.isArray(body)
            ? this.insert(body).returning('*')
            : this.insert(body).returning('*').first()
          : super.insertAndFetch(body);
      }

      patchAndFetchById(id, body) {
        return supportsReturning
          ? this.findById(id).patch(body).returning('*').first()
          : super.patchAndFetchById(id, body);
      }

      patchAndFetch(body) {
        return supportsReturning
          ? Array.isArray(body)
            ? this.patch(body).returning('*')
            : this.patch(body).returning('*').first()
          : super.patchAndFetch(body);
      }
    };
  }
}
