import jwt from 'express-jwt';

import config from '#config';
import { Failure } from '#lib/responseHelpers';
import { userCache } from '#utils/cache';
import { getUserById } from './db.js';

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

      // # Account no longer exists or role not authorized
      if (!user || (roles.length && !roles.includes(user.role.name.toLowerCase()))) {
        throw new Failure('Unauthorized', 401);
      }

      // # Authentication and authorization successful
      req.user = user;
      req.role = user.role;
      req.refreshTokens = user.refresh_tokens;

      next();
    },
  ];
};
