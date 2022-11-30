import { expressjwt as jwt } from 'express-jwt';

import config from '#config';
import { Failure } from '#lib/responseHelpers';
import { userCache } from '#utils/cache';
import { getUserById } from './db.js';
import { dbInstasnceStorage } from '#lib/asyncContexts';

const defaultOptions = {
  ignoreExpiration: false,
};

export default (roles = [], options = {}) => {
  if (!(typeof options === 'object' && !Array.isArray(options) && options !== null)) options = {};
  options = Object.assign({}, defaultOptions, options);

  if (typeof roles === 'object' && !Array.isArray(roles) && roles !== null) {
    options = Object.assign({}, defaultOptions, roles);
    roles = [];
  }

  if (typeof roles === 'string' && roles.length) {
    roles = [roles];
  } else {
    roles = [];
  }
  roles = roles.map((_) => _.toLowerCase());

  return [
    // # Authenticate JWT token and attach user to request object (req.user)
    jwt({
      secret: config.jwtSecret,
      algorithms: ['HS256'],
      ignoreExpiration: options.ignoreExpiration,
      requestProperty: 'user',
    }),

    // # Authorize based on user role
    async (req, res, next) => {
      let user = userCache.get(req.user.id);
      if (!user) {
        const users = await getUserById(req.user.id);
        user = users[0];
        userCache.set(req.user.id, user);
      }

      // # Account no longer exists
      if (!user) return res.status(404).send();
      // # role not authorized
      if (roles.length && !roles.includes(user.role.name.toLowerCase())) {
        throw new Failure('Unauthorized', 401);
      }

      const store = new Map();

      // !!! VERY IMPORTANT. PLEASE READ AND DO ACCORDINGLY
      // TODO: replace the values for the 2 set fn calls below with appropriate value
      // ^ `isDynamicLoadTenant` field can be true or false
      // ^    if false, it defines that the connection to be made is to one of the existing db connection defined in the env file
      // ^        the db to select is done by passing the db Id key to `tenantId` field
      // ^    if true, it defines to make a new connection for this request and discard at end of request
      // ^        this is usually for when the connection details are stored with the user and needs to make a connection to another db or schema with lesser permissions to actually get details of the user
      // ^        we will also need to pass the tenant connection information to `tenantInfo` field, which will be used while making the connection
      // ^        the `tenantId` key in this situation is simply and identifier to cache the connection
      // # There will not usually be a situation where, you will have to load more than 1 db at the startup of the application, but in case it is needed, it is supported
      // # If there is no multitenancy, Usually it will be 1 db which holds all the data, for the entire application, in which case feel free to comment out these `store` lines
      // # If there us multitenancy, Usually it will have 1 db with the user and connection information and another db or schema which contain the actual data which can only be access by that new connection
      // # if you're using multi-tenancy `isDynamicLoadTenant` will usually be set to true
      // ^ Even though you setup the connection details here, in case you need a another instance during execution for specific query, you can override it manually by passing the instance to the query function
      store.set('isDynamicLoadTenant', false);
      store.set('tenantId', 0);
      store.set('tenantInfo', null);
      // ;-------------------------------------------------

      // # Authentication and authorization successful
      req.user = user;
      req.role = user.role;

      dbInstasnceStorage.run(store, next);
    },
  ];
};
