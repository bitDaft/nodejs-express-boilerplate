import { expressjwt as jwt } from 'express-jwt';

import config from '#config';
import { isObject } from '#utils/isObject';
import { Failure } from '#lib/responseHelpers';
import { dbInstanceStorage } from '#lib/asyncContexts';

import {
  getCacheUser,
  getCacheUserParentTokens,
  setCacheUser,
  setCacheUserParentTokens,
} from './cache.js';
import { getUserById, getUserRootRefreshTokenById } from './db.js';

const defaultOptions = {
  ignoreExpiration: false,
};

export default (roles = [], options = {}) => {
  if (!isObject(options)) options = {};
  options = Object.assign({}, defaultOptions, options);

  if (isObject(roles)) {
    options = Object.assign({}, defaultOptions, roles);
    roles = [];
  }

  if (typeof roles === 'string' && roles.length) {
    roles = [roles];
  } else if (!Array.isArray(roles)) {
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
      let parentRefreshTokens = getCacheUserParentTokens(req.user.id);
      if (!parentRefreshTokens) {
        parentRefreshTokens = await getUserRootRefreshTokenById(req.user.id);
        setCacheUserParentTokens(req.user.id, parentRefreshTokens);
      }

      if (!parentRefreshTokens.find((rft) => rft.id === req.user.pid)) {
        throw new Failure('Unauthorized', 401);
      }

      let user = getCacheUser(req.user.id);
      if (!user) {
        const users = await getUserById(req.user.id);
        user = users[0];
        setCacheUser(req.user.id, user);
      }

      // # role not authorized or account no longer exists
      if (!user || (roles.length && !roles.includes(user.role.name.toLowerCase()))) {
        throw new Failure('Unauthorized', 401);
      }

      const store = new Map();

      // !!! VERY IMPORTANT. PLEASE READ AND DO ACCORDINGLY FOR MULTI-TENANCY IF NEEDED
      // TODO: replace the values for the 3 set fn calls below with appropriate value
      // ^ `isDynamicLoadTenant` field can be true or false
      // ^    if false, it defines that the connection to be made is to one of the existing db connection defined in the env file
      // ^        the db to select is done by passing the db Id key to `tenantId` field
      // ^    if true, it defines to make a new connection for this request and discard at end of request
      // ^        this is usually for when the connection details are stored with the user and needs to make a connection to another db or schema with lesser permissions to actually get details of the user
      // ^        we will also need to pass the tenant connection information to `tenantInfo` field, which will be used while making the connection
      // ^        the `tenantId` key in this situation is simply an identifier to cache the connection
      // # There will not usually be a situation where, you will have to load more than 1 db at the startup of the application, but in case it is needed, it is supported
      // # If there is no multitenancy, Usually it will be 1 db which holds all the data, for the entire application, in which case feel free to comment out these `store` lines
      // # If there is multitenancy, Usually it will have 1 db with the user and connection information and another db or schema which contain the actual data which can only be access by that new connection
      // # if you're using multi-tenancy `isDynamicLoadTenant` will usually be set to true
      // ^ Even though you setup the connection details here, in case you need a another instance during execution for specific query, you can override it manually by passing the instance to the query function
      store.set('isDynamicLoadTenant', false);
      store.set('tenantId', 0);
      store.set('tenantInfo', null);
      // ;-------------------------------------------------

      // # Authentication and authorization successful
      req.user = user;
      req.role = user.role;

      dbInstanceStorage.run(store, next);
    },
  ];
};
