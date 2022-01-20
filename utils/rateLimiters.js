import { RateLimiterMemory } from "rate-limiter-flexible";

export const middlewareLimiter = new RateLimiterMemory({
  keyPrefix: "middleware",
  points: 10,
  duration: 2,
});
