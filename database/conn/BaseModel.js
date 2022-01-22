import { Model } from "./dbinit.js";

export default class BaseModel extends Model {
  static get concurrency() {
    return 10;
  }

  static get useLimitInFirst() {
    return true;
  }

  $beforeValidate(jsonSchema, json, opt) {
    // # Converting datetime to iso string for schema validation
    for (let propertyName in jsonSchema.properties) {
      let schema = jsonSchema.properties[propertyName];
      if (schema && schema.format === "date-time") {
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
          typeof item[key] === "string" &&
          item[key].indexOf("T") === 10 &&
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
          typeof item[key] === "string" &&
          item[key].indexOf("T") === 10 &&
          new Date(item[key]).getTime()
        ) {
          item[key] = item[key].slice(0, 19);
        }
      }
    }
  }
}
