// src/routes/me.ts
import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { invalidateCache } from '../middleware/cache';
import { t } from '../i18n';

import {
  addFavorite,
  deleteUserReview,
  getUserById,
  listFavoritesByUser,
  listReviewsByUser,
  removeFavorite,
  updateUserReview,
} from '../services/userService';

const router = Router();

/** GET /me */
router.get('/', authMiddleware, (req: AuthRequest, res) => {
  const user = getUserById(req.user!.id);
  res.json(user);
});

/** GET /me/reviews */
router.get('/reviews', authMiddleware, (req: AuthRequest, res) => {
  const rows = listReviewsByUser(req.user!.id);
  res.json(rows);
});

// Schemas
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

const reviewIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const restaurantIdParamsSchema = z.object({
  restaurantId: z.coerce.number().int().positive(),
});

/** PUT /me/reviews/:id */
router.put(
  '/reviews/:id',
  authMiddleware,
  validateParams(reviewIdParamsSchema),
  validateBody(reviewSchema),
  (req: AuthRequest, res) => {
    const { id } = req.params as any;
    const { rating, comment } = req.body;

    const result = updateUserReview({
      reviewId: id,
      userId: req.user!.id,
      rating,
      comment,
    });

    if (result.type === 'NOT_FOUND') {
      return res.status(404).json({ message: t(req, 'REVIEW_NOT_FOUND') });
    }

    invalidateCache();
    res.json({ message: t(req, 'REVIEW_UPDATED') });
  }
);

/** DELETE /me/reviews/:id */
router.delete(
  '/reviews/:id',
  authMiddleware,
  validateParams(reviewIdParamsSchema),
  (req: AuthRequest, res) => {
    const { id } = req.params as any;

    const result = deleteUserReview(id, req.user!.id);

    if (result.type === 'NOT_FOUND') {
      return res.status(404).json({ message: t(req, 'REVIEW_NOT_FOUND') });
    }

    invalidateCache();
    res.status(204).send();
  }
);

/** POST /me/favorites/:restaurantId */
router.post(
  '/favorites/:restaurantId',
  authMiddleware,
  validateParams(restaurantIdParamsSchema),
  (req: AuthRequest, res) => {
    const { restaurantId } = req.params as any;

    const result = addFavorite(req.user!.id, restaurantId);

    if (result.type === 'RESTAURANT_NOT_FOUND') {
      return res.status(404).json({ message: t(req, 'RESTAURANT_NOT_FOUND') });
    }

    invalidateCache();
    res.status(201).json({ message: t(req, 'FAVORITE_ADDED') });
  }
);

/** DELETE /me/favorites/:restaurantId */
router.delete(
  '/favorites/:restaurantId',
  authMiddleware,
  validateParams(restaurantIdParamsSchema),
  (req: AuthRequest, res) => {
    const { restaurantId } = req.params as any;

    removeFavorite(req.user!.id, restaurantId);

    invalidateCache();
    res.status(204).send();
  }
);

/** GET /me/favorites */
router.get('/favorites', authMiddleware, (req: AuthRequest, res) => {
  const rows = listFavoritesByUser(req.user!.id);
  res.json(rows);
});

export default router;