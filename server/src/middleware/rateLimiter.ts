import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs?: number; // Time window in ms (default: 15 minutes)
  max?: number; // Max requests per window per IP (default: 500)
  message?: string;
}

export const rateLimiter = (options: RateLimitOptions = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 500;
  const message =
    options.message || "Too many requests from this IP, please try again later.";

  // Periodic cleanup every 10 minutes
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (store[ip].resetTime <= now) {
        delete store[ip];
      }
    }
  }, 10 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip =
      req.ip ||
      (req.headers["x-forwarded-for"] as string) ||
      req.socket.remoteAddress ||
      "unknown";
    const now = Date.now();

    if (!store[ip] || store[ip].resetTime <= now) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    store[ip].count += 1;
    const remaining = Math.max(0, max - store[ip].count);
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader(
      "X-RateLimit-Reset",
      Math.ceil(store[ip].resetTime / 1000)
    );

    if (store[ip].count > max) {
      res.status(429).json({
        success: false,
        error: message,
        retryAfterMs: store[ip].resetTime - now,
      });
      return;
    }

    next();
  };
};
