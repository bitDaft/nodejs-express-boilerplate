import crypto from 'crypto';

import { BaseModel } from '#conns';
import { RefreshToken, Role } from '#models';
import { randomToken } from '#utils/randomTokenString';
import { MINUTE } from '#utils/timeConstants';

export default class User extends BaseModel {
  static tableName = 'user';

  setPassword(password) {
    this.salt = randomToken();
    this.password = crypto.scryptSync(password, this.salt, 64).toString('hex');
  }

  validatePassword(password) {
    let pass_hash = crypto.scryptSync(password, this.salt, 64).toString('hex');
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

  isVerified() {
    return !!(
      this.valid &&
      this.verification_token === null &&
      this.verification_on &&
      this.verification_expiry === null
    );
  }

  static get relationMappings() {
    return {
      role: {
        relation: this.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'user.role_id',
          to: 'role.id',
        },
      },
      refresh_token: {
        relation: this.HasOneRelation,
        modelClass: RefreshToken,
        join: {
          from: 'user.id',
          to: 'refresh_token.user_id',
        },
      },
    };
  }
}
