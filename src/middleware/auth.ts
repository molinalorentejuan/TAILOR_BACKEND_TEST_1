import { NextFunction, Response, Request } from 'express';
import { verifyToken } from '../utils/jwt';
import { t } from '../i18n';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: 'USER' | 'ADMIN';
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: t(req, 'UNAUTHORIZED') });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: t(req, 'UNAUTHORIZED') });
  }

  try {
    const payload = verifyToken(token) as { id: number; role: 'USER' | 'ADMIN' };
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: t(req, 'UNAUTHORIZED') });
  }
}

export function roleMiddleware(roles: Array<'USER' | 'ADMIN'>) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: t(req, 'UNAUTHORIZED') });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: t(req, 'FORBIDDEN') });
    }

    next();
  };
}