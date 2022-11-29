import { RateLimiterMemory } from "rate-limiter-flexible";

export const limiterMiddleware = new RateLimiterMemory({
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

export const APIKeylimiterMiddleware = new RateLimiterMemory({
  keyPrefix: "middleware",
  points: 100,
  duration: 1,
});
