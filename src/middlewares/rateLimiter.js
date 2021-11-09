import { middlewareLimiter } from "#utils/rateLimiters";

export default async (req, res, next) =>
  middlewareLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send("Too Many Requests"));
