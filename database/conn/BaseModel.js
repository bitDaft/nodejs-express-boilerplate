import { Model, compose } from 'objection';

// ^ this config import is not used in this file
// ^ but due to module resolution order of TLA, we need this to prevent loading of this file prematurely
// ! DO NOT REMOVE THIS CONFIG IMPORT
import '#config';
import { __dirname } from '#lib/getFileDir';
import { dbInstanceStorage } from '#lib/asyncContexts';
import { dbKeys, getKnexDBInstance, getKnexTenantInstance } from '#conns';

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
      if (dynLoad) {
        knexInstance = getKnexTenantInstance(tenantId, tenantInfo);
      } else {
        knexInstance = getKnexDBInstance(tenantId);
      }
    } else {
      knexInstance = args;
    }
    const superVal = super.query(knexInstance);
    return superVal;
  }
}
