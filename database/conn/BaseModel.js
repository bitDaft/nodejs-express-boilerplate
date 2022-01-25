import path from 'path';
import fs from 'fs';
import { compose } from 'objection';
import softDelete from 'objection-soft-delete';

import { __dirname } from '#lib/getFileDir';
import { jsonLoaderSync } from '#lib/jsonLoader';
import { Model } from './dbinit.js';
import config from '#config';

const jsonSchemas = {};
const supportsReturning = ['pg', 'mssql'].includes(config.DB_client);

const mixins = compose(
  softDelete({ columnName: 'is_deleted', deletedValue: true, notDeletedValue: false })
);

export default class BaseModel extends mixins(Model) {
  static concurrency = 10;
  static useLimitInFirst = true;
  static uidProp = 'uid';

  static get jsonSchema() {
    const filename = this.name[0].toLowerCase() + this.name.slice(1);
    if (!jsonSchemas.hasOwnProperty(filename)) {
      const filepath = path.join(__dirname(import.meta), '../schema', filename + '.json');
      if (!fs.existsSync(filepath)) {
        console.warn(
          `Schema file for model '${this.name}' missing. It is recommended to create a JSON schema file for it at '${filepath}'`
        );
        jsonSchemas[filename] = null;
      } else {
        jsonSchemas[filename] = jsonLoaderSync(filepath);
      }
    }
    return jsonSchemas[filename];
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

  static get QueryBuilder() {
    // # Wrapping some fns to use returning if it supports it
    return class extends super.QueryBuilder {
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
