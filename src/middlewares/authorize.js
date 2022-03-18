import jwt from 'express-jwt';

import config from '#config';
import { Failure } from '#lib/responseHelpers';
import { userCache } from '#utils/cache';
import { getUserById } from './db.js';

export default (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  roles = roles.map((_) => _.toLowerCase());

  return [
    // # Authenticate JWT token and attach user to request object (req.user)
    jwt({
      secret: config.jwtSecret,
      algorithms: ['HS256'],
    }),

    async (req, res, next) => {
      // # Authorize based on user role
      let user = userCache.get(req.user.id);
      if (!user) {
        let users = await getUserById(req.user.id);
        user = users[0];
        userCache.set(req.user.id, user);
      }

      if (!user || (roles.length && !roles.includes(user.role.name.toLowerCase()))) {
        // # Account no longer exists or role not authorized
        return next(new Failure('Unauthorized', 401));
      }

      // # Authentication and authorization successful
      req.user = user;
      req.role = user.role;
      req.refreshTokens = user.refresh_tokens;

      next();
    },
  ];
};
