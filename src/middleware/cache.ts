import NodeCache from 'node-cache';
import { Request, Response, NextFunction } from 'express';

const cache = new NodeCache({ stdTTL: 30 });

export function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const hit = cache.get(key);
  if (hit) return res.json(hit);

  const original = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body);
    return original(body);
  };

  next();
}

export function invalidateCache() {
  cache.flushAll();
}
