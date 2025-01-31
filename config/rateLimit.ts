import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redisDB";

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1000, "1m"),
  analytics: true,
});

export default ratelimit;
