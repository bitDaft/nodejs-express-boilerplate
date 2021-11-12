import { BaseModel } from "#conns";
import { User } from "#models";

export default class Role extends BaseModel {
  static get tableName() {
    return "role";
  }

  static get jsonSchema() {
    return {
      title: "Role",
      description: "Defines the roles and their permissions",
      type: "object",
      required: ["name"],
      properties: {
        id: {
          type: "integer",
          description: "the unique key",
        },
        name: {
          type: "string",
          description: "name or username of the user",
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

  static get relationMappings() {
    return {
      users: {
        relation: this.HasManyRelation,
        modelClass: User,
        join: {
          from: "role.id",
          to: "user.role_id",
        },
      },
    };
  }
}
