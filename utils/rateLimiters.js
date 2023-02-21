import { RateLimiterMemory } from "rate-limiter-flexible";

export const limiterMiddleware = new RateLimiterMemory({
  keyPrefix: "middleware",
  points: 6,
  duration: 1,
});

export const APIKeylimiterMiddleware = new RateLimiterMemory({
  keyPrefix: "middleware_api",
  points: 20,
  duration: 1,
});
