import User from './user.js';
import Role from './role.js';
import RefreshToken from './refreshToken.js';

export default exp = {
  User,
  Role,
  RefreshToken,
};

// # Loads the metadata of all tables at app initialize in case it may be needed
Object.values(exp).forEach(async (model) => await model.fetchTableMetadata());
