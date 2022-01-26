import User from './user.js';
import Role from './role.js';
import RefreshToken from './refreshToken.js';

import { initialize } from 'objection';
import { knexI } from '#conns';

// # Loads the metadata of all tables at app initialize in case it may be needed
// ^ Add new models into this array too.
for (let key in knexI) {
  await initialize(knexI[key], [User, Role, RefreshToken]);
}

export { User, Role, RefreshToken };
