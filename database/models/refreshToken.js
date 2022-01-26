import { BaseModel } from '#conns';
import { User } from '#models';

export default class RefreshToken extends BaseModel {
  static tableName = 'refresh_token';

  isValid() {
    return Date.now() < new Date(this.expires).getTime();
  }

  static get relationMappings() {
    return {
      user: {
        relation: this.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'refresh_token.user_id',
          to: 'user.id',
        },
      },
    };
  }
}
