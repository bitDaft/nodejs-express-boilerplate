import crypto from "crypto";

import { BaseModel } from "#conns";
import { RefreshToken, Role } from "#models";
import { randomToken } from "#utils/randomTokenString";
import { MINUTE } from "#utils/timeConstants";

export default class User extends BaseModel {
  static get tableName() {
    return "user";
  }

  setPassword(password) {
    this.salt = randomToken();
    this.password = crypto.scryptSync(password, this.salt, 64).toString("hex");
  }

  validatePassword(password) {
    let pass_hash = crypto.scryptSync(password, this.salt, 64).toString("hex");
    return pass_hash === this.password;
  }

  verify() {
    this.verification_token = null;
    this.verification_expiry = null;
    this.verification_on = new Date();
    this.valid = true;
  }

  reset() {
    this.reset_token = randomToken();
    this.reset_token_expiry = new Date(Date.now() + 30 * MINUTE);
  }

  get isVerified() {
    return !!(
      this.valid &&
      this.verification_token === null &&
      this.verification_on &&
      this.verification_expiry === null
    );
  }

  static get jsonSchema() {
    return {
      title: "User",
      description: "Holds information regarding the user",
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        id: {
          type: "integer",
          description: "the unique key",
        },
        name: {
          type: "string",
          description: "name  of the user",
        },
        email: {
          type: "string",
          format: "email",
          description: "email of the user",
        },
        password: {
          type: "string",
          description: "hashed password of the user",
        },
        verification_token: {
          type: "string",
          description: "token used to verify the user",
        },
        verification_on: {
          type: "string",
          format: "date-time",
          description: "when the user was verified",
        },
        verification_expiry: {
          type: "string",
          format: "date-time",
          description: "the time before which user should verify",
        },
        reset_token: {
          type: "string",
          description: "token used to reset the user password",
        },
        reset_token_expiry: {
          type: "string",
          format: "date-time",
          description: "the time before which user should reset their password",
        },
        salt: {
          type: "string",
          description: "salt for the user",
        },
        valid: {
          type: "boolean",
          description: "whether the user account is valid or not",
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
      role: {
        relation: this.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: "user.role_id",
          to: "role.id",
        },
      },
      refresh_token: {
        relation: this.HasOneRelation,
        modelClass: RefreshToken,
        join: {
          from: "user.id",
          to: "refresh_token.user_id",
        },
      },
    };
  }
}
