import User from './user.js';
import Role from './role.js';
import RefreshToken from './refreshToken.js';

import { initialize } from 'objection';

// # Loads the metadata of all tables at app initialize in case it may be needed
// ^ Add new models into this array too.
await initialize([User, Role, RefreshToken]);

export { User, Role, RefreshToken };
