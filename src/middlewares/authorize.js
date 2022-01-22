import { User } from '#models';

import jwt from 'express-jwt';

import config from '#config';
import { Failure } from '#lib/responseHelpers';
import { easyCatch } from '#lib/easyCatch';

export default (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  roles = roles.map((_) => _.toLowerCase());

  return [
    // # Authenticate JWT token and attach user to request object (req.user)
    jwt({
      secret: config.JWT_SECRET,
      algorithms: ['HS256'],
    }),

    // # In case JWT fails, handle it here itself
    (err, req, res, next) => {
      if (err.name === 'UnauthorizedError') {
        return next(new Failure('Unauthorized', 401));
      }
    },

    // # Authorize based on user role
    async (req, res, next) => {
      let authCatch = easyCatch('Unable to get user');
      let users = await getUserById(req.user.id).catch(authCatch('user fetch authorize'));

      let user = users[0];

      if (!user || (roles.length && !roles.includes(user.role.name.toLowerCase()))) {
        // # Account no longer exists or role not authorized
        return next(new Failure('Unauthorized', 401));
      }

      // # Authentication and authorization successful
      req.user = user;
      req.role = user.role;
      req.refresh_token = user.refresh_token;
      // await user.wallet.validateTokens();

      next();
    },
  ];
};
