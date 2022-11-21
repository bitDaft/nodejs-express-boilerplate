import { Model, compose } from 'objection';

// ^ this config import is not used in this file
// ^ but due to module resolution of TLA, we need this to prevent loading of this file prematurely
// ! DO NOT REMOVE THIS CONFIG IMPORT
import config from '#config';
import { __dirname } from '#lib/getFileDir';
import { knexMain } from '#conns';

const returningCache = {};

const mixins = compose();
let knexKeys = Object.keys(knexMain);
if (knexKeys.length === 1) Model.knex(knexMain[knexKeys[0]]);

export default class BaseModel extends mixins(Model) {
  static concurrency = 10;
  static useLimitInFirst = true;
  static uidProp = '#uid';

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

  // ? not sure if needed if multi db, need to test
  // TODO: test if required
  // static query(...args) {
  //   if (args[0]) this.knex(args[0]);
  //   return super.query(...args);
  // }

  static get QueryBuilder() {
    let supportsReturning = returningCache[this.knex().context.userParams.client];
    if (supportsReturning === undefined) {
      supportsReturning = returningCache[this.knex().context.userParams.client] = [
        'pg',
        'mssql',
      ].includes(this.knex().context.userParams.client.split('_')[0]);
    }
    return class extends Model.QueryBuilder {
      // # Wrapping some fns to use returning if it supports it
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
