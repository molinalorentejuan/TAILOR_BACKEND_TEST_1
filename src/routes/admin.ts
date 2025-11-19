import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { getAdminStats } from '../services/adminService';

const router = Router();

/** GET /admin/stats */
router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  (req, res) => {
    const stats = getAdminStats();
    res.json(stats);
  }
);

export default router;