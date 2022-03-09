import User from './user.js';
import Role from './role.js';
import RefreshToken from './refreshToken.js';

import { initialize } from 'objection';
import { knexMain } from '#conns';

// # Loads the metadata of all tables at app initialize in case it may be needed
// ^ Add new models into appropriate array too.
const dbTables = {
  0: [User, Role, RefreshToken],
  1: [],
};
for (let key in knexMain) {
  await initialize(knexMain[key], dbTables[key]);
}

export { User, Role, RefreshToken };
