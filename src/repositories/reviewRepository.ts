import { injectable } from "tsyringe";
import db from "../db/db";

export interface ReviewRow {
  id: number;
  userId: number;
  restaurantId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface UserReviewRow extends ReviewRow {
  restaurantName: string;
}

export interface RestaurantReviewRow extends ReviewRow {
  userEmail: string;
}

/**
 * ReviewRepository (DI Ready)
 * ---------------------------
 * - No AppError aquí.
 * - No validación aquí.
 * - Solo SQL.
 * - DI completa con @injectable()
 * - Tipos estrictos para todas las consultas.
 */

@injectable()
export class ReviewRepository {
  listReviewsByUser(userId: number): UserReviewRow[] {
    return db
      .prepare(
        `
        SELECT rv.*, r.name as restaurantName
        FROM reviews rv
        JOIN restaurants r ON r.id = rv.restaurantId
        WHERE rv.userId = ?
        ORDER BY rv.createdAt DESC
      `
      )
      .all(userId) as UserReviewRow[];
  }

  findUserReview(
    reviewId: number,
    userId: number
  ): ReviewRow | undefined {
    return db
      .prepare("SELECT * FROM reviews WHERE id=? AND userId=?")
      .get(reviewId, userId) as ReviewRow | undefined;
  }

  updateReview(reviewId: number, rating: number, comment?: string) {
    return db
      .prepare("UPDATE reviews SET rating=?, comment=? WHERE id=?")
      .run(rating, comment || null, reviewId);
  }

  deleteReview(reviewId: number) {
    return db
      .prepare("DELETE FROM reviews WHERE id=?")
      .run(reviewId);
  }

  listReviewsForRestaurant(
    restaurantId: number
  ): RestaurantReviewRow[] {
    return db
      .prepare(
        `
        SELECT rv.*, u.email as userEmail
        FROM reviews rv
        JOIN users u ON u.id = rv.userId
        WHERE rv.restaurantId=?
        ORDER BY rv.createdAt DESC
      `
      )
      .all(restaurantId) as RestaurantReviewRow[];
  }

  insertReview(
    userId: number,
    restaurantId: number,
    rating: number,
    comment?: string
  ) {
    return db
      .prepare(
        `
        INSERT INTO reviews (userId, restaurantId, rating, comment)
        VALUES (?, ?, ?, ?)
      `
      )
      .run(userId, restaurantId, rating, comment || null);
  }
}