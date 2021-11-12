import { BaseModel } from "#conns";
import { User } from "#models";

export default class RefreshToken extends BaseModel {
  static get tableName() {
    return "refresh_token";
  }

  get isValid() {
    return Date.now() < new Date(this.expires).getTime();
  }

  static get jsonSchema() {
    return {
      title: "Refresh_Token",
      description: "Holds all the refresh tokens in use",
      type: "object",
      required: ["user_id", "refresh_token", "expires"],
      properties: {
        id: {
          type: "integer",
          description: "the unique key",
        },
        user_id: {
          type: "integer",
          description: "the ID of the user that uses this refresh token",
        },
        refresh_token: {
          type: "string",
          description: "the refresh token",
        },
        expires: {
          type: "string",
          format: "date-time",
          description: "the time this refresh token expires",
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
      user: {
        relation: this.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "refresh_token.user_id",
          to: "user.id",
        },
      },
    };
  }
}
