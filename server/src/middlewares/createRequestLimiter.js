const { redisClient } = require("../config/redisConfig");

const createRateLimiter = (maxRequests, windowSizeInSeconds) => {
  return async (req, res, next) => {
    const ip = req.ip;

    try {
      const keyExists = await redisClient.exists(ip);

      if (!keyExists) {
        const setTransaction = redisClient.multi();
        setTransaction.set(ip, 1).expire(ip, windowSizeInSeconds);
        await setTransaction.exec();
        return next();
      }

      const transaction = redisClient.multi();
      transaction.incr(ip).ttl(ip);
      const [requestCount, ttl] = await transaction.exec();

      console.log("Request count and TTL", requestCount, ttl);

      if (requestCount > maxRequests) {
        res.set("Retry-After", ttl);
        return res.status(429).json({
          message: "Too Many Requests",
          retryAfter: ttl,
        });
      } else {
        next();
      }
    } catch (err) {
      console.error("Redis error:", err);
      return res.status(500).send("Internal Server Error");
    }
  };
};

module.exports = { createRateLimiter };
