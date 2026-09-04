const rateLimitStore = new Map();

export const createRateLimiter = (options = { windowMs: 60 * 1000, maxRequests: 10 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `${req.baseUrl || ''}_${ip}`;
    const now = Date.now();

    const record = rateLimitStore.get(key) || { count: 0, resetTime: now + options.windowMs };

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + options.windowMs;
    }

    record.count += 1;
    rateLimitStore.set(key, record);

    if (record.count > options.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        success: false,
        error: `Too many requests. Please try again in ${retryAfter} seconds.`
      });
    }

    next();
  };
};
