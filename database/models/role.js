import { BaseModel } from '#conns';
import { User } from '#models';

export default class Role extends BaseModel {
  static tableName = 'role';

  static get relationMappings() {
    return {
      users: {
        relation: this.HasManyRelation,
        modelClass: User,
        join: {
          from: 'role.id',
          to: 'user.role_id',
        },
      },
    };
  }
}
