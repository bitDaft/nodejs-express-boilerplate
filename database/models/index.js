import User from './user.js';
import Role from './role.js';
import RefreshToken from './refreshToken.js';

// # This section is simply to obtain the metadata for the tables from db before the start of the application
// ? If you feel you have a need to get the metadata beforehand, uncomment from line 9-10, 14-21
// # otherwise feel free to ignore

// import { initialize } from 'objection';
// import { dbKeys, getKnexDBInstance } from '#conns';

// ^ Add new models into appropriate db's array
// ^ the number (0,1,...) associated to a db is defined in your env file
// const dbTables = {
//   0: [User, Role, RefreshToken],
//   1: [],
// };
// // # Loads the metadata of all tables at app initialize in case it may be needed
// for (let key of dbKeys) {
//   if (dbTables[key].length) await initialize(getKnexDBInstance(key), dbTables[key]);
// }

export { User, Role, RefreshToken };
