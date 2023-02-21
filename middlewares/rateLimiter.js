import { limiterMiddleware, APIKeylimiterMiddleware } from '#utils/rateLimiters';

export const rateLimiterMiddleware = async (req, res, next) => {
  let rateLimiterUsed = limiterMiddleware;
  // ^ this is naive check if it is api, since anyone can simply add the header to bypass the normal limit
  // TODO: change this so that the api key is valid to use this limiter
  if (req.get('X-API')) rateLimiterUsed = APIKeylimiterMiddleware;
  return rateLimiterUsed
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send('Too Many Requests'));
};
// const headers = {
//   'Retry-After': rateLimiterRes.msBeforeNext / 1000,
//   'X-RateLimit-Limit': opts.points,
//   'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
//   'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext),
// };
