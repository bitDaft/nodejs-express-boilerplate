import { limiterMiddleware } from '#utils/rateLimiters';

export const rateLimiterMiddleware = async (req, res, next) =>
  limiterMiddleware
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send('Too Many Requests'));

// const headers = {
//   'Retry-After': rateLimiterRes.msBeforeNext / 1000,
//   'X-RateLimit-Limit': opts.points,
//   'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
//   'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext),
// };
