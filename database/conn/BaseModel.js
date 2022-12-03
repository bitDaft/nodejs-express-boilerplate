import { Model, compose } from 'objection';

// ^ this config import is not used in this file
// ^ but due to module resolution of TLA, we need this to prevent loading of this file prematurely
// ! DO NOT REMOVE THIS CONFIG IMPORT
import config from '#config';
import { __dirname } from '#lib/getFileDir';
import { dbKeys, getKnexDBInstance, getKnexTenantInstance } from '#conns';
import { dbInstanceStorage } from '#lib/asyncContexts';

const returningCache = {};

for (const key of dbKeys) {
  const inst = getKnexDBInstance(key);
  const clientParam = inst.context.userParams.client;
  returningCache[clientParam] = ['pg', 'mssql'].includes(clientParam.split('_')[0]);
}

const mixins = compose();
const singleDb = dbKeys.length === 1;
if (singleDb) Model.knex(getKnexDBInstance(dbKeys[0]));

export default class BaseModel extends mixins(Model) {
  static concurrency = 10;
  static useLimitInFirst = true;
  static uidProp = '#uid';

  static async beforeInsert({ inputItems }) {
    // # Removing datetime iso string tz info, use this fn if field in DB is DATETIME and not TIMESTAMP
    for (let item of inputItems) {
      for (const key in item) {
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
      for (const key in item) {
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

  // # this is needed to work with both default and specified db
  // # context allows to auto fetch the tenant details without user intervention
  static query(args) {
    let knexInstance = undefined;
    if (!args) {
      const store = dbInstanceStorage.getStore();
      const dynLoad = store?.get('isDynamicLoadTenant');
      const tenantId = store?.get('tenantId');
      const tenantInfo = store?.get('tenantInfo');
      if (dynLoad === true) {
        knexInstance = getKnexTenantInstance(tenantId, tenantInfo);
      } else if (dynLoad === false) {
        knexInstance = getKnexDBInstance(tenantId);
      }
    } else {
      knexInstance = args;
    }
    if (knexInstance) this.knex(knexInstance);
    const superVal = super.query(knexInstance);
    if (knexInstance) this.knex(singleDb ? getKnexDBInstance(dbKeys[0]) : null);
    return superVal;
  }

  static get QueryBuilder() {
    let supportsReturning = false;
    const clientParam = this.knex()?.context?.userParams?.client;
    if (clientParam) supportsReturning = returningCache[clientParam];
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
