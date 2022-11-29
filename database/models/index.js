import User from './user.js';
import Role from './role.js';
import RefreshToken from './refreshToken.js';

import { initialize } from 'objection';
import { knexMain } from '#conns';

// ^ Add new models into appropriate db's array
// ^ the number (0,1,...) associated to a db is defined in your env file
const dbTables = {
  0: [User, Role, RefreshToken],
  1: [],
};

// # Loads the metadata of all tables at app initialize in case it may be needed
for (let key in knexMain) {
  if (dbTables[key].length) await initialize(knexMain[key], dbTables[key]);
}

export { User, Role, RefreshToken };
