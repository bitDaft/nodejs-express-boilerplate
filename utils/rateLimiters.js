import { RateLimiterMemory } from "rate-limiter-flexible";

export const limiterMiddleware = new RateLimiterMemory({
  keyPrefix: "middleware",
  points: 100,
  duration: 1,
});
