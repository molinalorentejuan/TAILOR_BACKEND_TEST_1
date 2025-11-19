import rateLimit from 'express-rate-limit';
import { t } from '../i18n';

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minuto
  max: 10,               // 10 peticiones por minuto
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      message: t(req, 'TOO_MANY_REQUESTS'),
    });
  },
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minuto
  max: 200,              // 200 peticiones por minuto
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      message: t(req, 'TOO_MANY_REQUESTS'),
    });
  },
});