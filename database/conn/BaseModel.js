import path from 'path';

import { __dirname } from '#lib/getFileDir';
import { jsonLoaderSync } from '#lib/jsonLoader';
import { Model } from './dbinit.js';

const jsonSchemas = {};

export default class BaseModel extends Model {
  static concurrency = 10;
  static useLimitInFirst = true;

  static get jsonSchema() {
    const filename = this.name[0].toLowerCase() + this.name.slice(1);
    if (!jsonSchemas.hasOwnProperty(filename)) {
      jsonSchemas[filename] = jsonLoaderSync(
        path.join(__dirname(import.meta), '../schema', filename + '.json')
      );
    }
    return jsonSchemas[filename];
  }

  $beforeValidate(jsonSchema, json, opt) {
    // # Converting datetime to iso string for schema validation
    for (let propertyName in jsonSchema.properties) {
      let schema = jsonSchema.properties[propertyName];
      if (schema && schema.format === 'date-time') {
        const valueToValidate = json[propertyName];
        if (valueToValidate && valueToValidate.getTime()) {
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
          item[key] = item[key].slice(0, 19);
        }
      }
    }
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
          item[key] = item[key].slice(0, 19);
        }
      }
    }
  }
}
