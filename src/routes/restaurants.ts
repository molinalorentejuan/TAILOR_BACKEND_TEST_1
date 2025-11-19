import { Router } from 'express';
import { cacheMiddleware, invalidateCache } from '../middleware/cache';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateQuery, validateBody, validateParams } from '../middleware/validate';
import { z } from 'zod';
import { t } from '../i18n';
import {
  createReviewForRestaurant,
  getRestaurantById,
  listRestaurants,
  listReviewsForRestaurant,
} from '../services/restaurantService';

const router = Router();

const listSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  cuisine: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  neighborhood: z.string().optional(),
  sort: z.string().regex(/^[a-zA-Z_]+:(asc|desc)$/).optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/** GET /restaurants */
router.get('/', validateQuery(listSchema), cacheMiddleware, (req, res) => {
  const { page, limit, cuisine, rating, neighborhood, sort } = req.query as any;
  const result = listRestaurants({ page, limit, cuisine, rating, neighborhood, sort });
  res.json(result);
});

/** GET /restaurants/:id */
router.get(
  '/:id',
  validateParams(idParamSchema),
  cacheMiddleware,
  (req, res) => {
    const { id } = req.params as any;
    const restaurant = getRestaurantById(id);

    if (!restaurant) {
      return res.status(404).json({ message: t(req, 'RESTAURANT_NOT_FOUND') });
    }

    res.json(restaurant);
  }
);

/** GET /restaurants/:id/reviews */
router.get(
  '/:id/reviews',
  validateParams(idParamSchema),
  cacheMiddleware,
  (req, res) => {
    const { id } = req.params as any;
    const reviews = listReviewsForRestaurant(id);
    res.json(reviews);
  }
);

/** POST /restaurants/:id/reviews */
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

router.post(
  '/:id/reviews',
  validateParams(idParamSchema),
  authMiddleware,
  validateBody(reviewSchema),
  (req: AuthRequest, res) => {
    const { id } = req.params as any;
    const { rating, comment } = req.body;

    const result = createReviewForRestaurant({
      userId: req.user!.id,
      restaurantId: id,
      rating,
      comment,
    });

    if (result.type === 'RESTAURANT_NOT_FOUND') {
      return res.status(404).json({ message: t(req, 'RESTAURANT_NOT_FOUND') });
    }

    invalidateCache();
    res.status(201).json({ id: result.id });
  }
);

export default router;