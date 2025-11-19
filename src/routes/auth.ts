import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { authRateLimiter } from '../middleware/rateLimit';
import { z } from 'zod';
import { t } from '../i18n';
import { registerUser, loginUser } from '../services/authService';

const router = Router();

// Body schema for register
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});
// Body schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * POST /auth/register
 */
router.post('/register', authRateLimiter, validateBody(registerSchema), (req, res) => {
  const { email, password, name } = req.body;

  const result = registerUser(email, password, name);

  if (result.type === 'EMAIL_IN_USE') {
    return res.status(400).json({ message: t(req, 'EMAIL_IN_USE') });
  }

  return res.status(201).json({ token: result.token });
});

/**
 * POST /auth/login
 */
router.post('/login', authRateLimiter, validateBody(loginSchema), (req, res) => {
  const { email, password } = req.body;

  const result = loginUser(email, password);

  if (result.type === 'INVALID_CREDENTIALS') {
    return res.status(400).json({ message: t(req, 'INVALID_CREDENTIALS') });
  }

  return res.json({ token: result.token });
});

export default router;