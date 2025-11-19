import { Router } from 'express';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { invalidateCache } from '../middleware/cache';
import { z } from 'zod';
import { t } from '../i18n';
import {
  createRestaurant,
  updateRestaurant,
  deleteRestaurantById,
} from '../services/restaurantAdminService';
import { getAdminStats } from '../services/adminService';

const router = Router();

const schema = z.object({
  name: z.string(),
  cuisine: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  neighborhood: z.string().optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/** POST /restaurants */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validateBody(schema),
  (req: AuthRequest, res) => {
    const { name, cuisine, rating = 0, neighborhood } = req.body;

    const result = createRestaurant({ name, cuisine, rating, neighborhood });

    invalidateCache();
    res.status(201).json({ id: result.id });
  }
);

/** PUT /restaurants/:id */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validateParams(idParamSchema),
  validateBody(schema.partial()),
  (req: AuthRequest, res) => {
    const { id } = req.params as any;
    const { name, cuisine, rating, neighborhood } = req.body;

    const result = updateRestaurant(id, { name, cuisine, rating, neighborhood });

    if (result.type === 'NOT_FOUND') {
      return res
        .status(404)
        .json({ message: t(req, 'RESTAURANT_NOT_FOUND') });
    }

    invalidateCache();
    res.json({ message: t(req, 'RESTAURANT_UPDATED') });
  }
);

/** DELETE /restaurants/:id */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validateParams(idParamSchema),
  (req: AuthRequest, res) => {
    const { id } = req.params as any;

    const result = deleteRestaurantById(id);

    if (result.type === 'NOT_FOUND') {
      return res
        .status(404)
        .json({ message: t(req, 'RESTAURANT_NOT_FOUND') });
    }

    invalidateCache();
    res.status(204).send();
  }
);

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