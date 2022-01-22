import { limiterMiddleware } from '#utils/rateLimiters';

export const rateLimiterMiddleware = async (req, res, next) =>
  limiterMiddleware
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send('Too Many Requests'));
