import { BaseModel } from "#conns";

export default class Test extends BaseModel {
  static get tableName() {
    return "test";
  }

  static get jsonSchema() {
    return {
      title: "Test",
      description: "Test Model definition",
      type: "object",
      required: ["test_required_field"],
      properties: {
        id: {
          type: "integer",
          description: "the unique key",
        },
        test_field_1: {
          type: "string",
          description: "a test field",
        },
        test_required_field: {
          type: "integer",
          description: "a required test field",
        },
        additional_information: {
          type: "object",
          description: "any additional information for this record",
        },
        created_at: {
          type: "string",
          format: "date-time",
          description: "when this record was created and added to db",
        },
        updated_at: {
          type: "string",
          format: "date-time",
          description: "the date time of the last update of the record",
        },
      },
    };
  }
}
