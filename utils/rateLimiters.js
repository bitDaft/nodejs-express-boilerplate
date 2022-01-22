import { RateLimiterMemory } from "rate-limiter-flexible";

export const limiterMiddleware = new RateLimiterMemory({
  keyPrefix: "middleware",
  points: 10,
  duration: 2,
});
