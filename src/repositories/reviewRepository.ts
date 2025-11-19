// src/repositories/reviewRepo.ts
import db from "../db";

export function listReviewsByUser(userId: number) {
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
    .all(userId);
}

export function findUserReview(reviewId: number, userId: number) {
  return db
    .prepare("SELECT * FROM reviews WHERE id=? AND userId=?")
    .get(reviewId, userId);
}

export function updateReview(reviewId: number, rating: number, comment?: string) {
  return db
    .prepare("UPDATE reviews SET rating=?, comment=? WHERE id=?")
    .run(rating, comment || null, reviewId);
}

export function deleteReview(reviewId: number) {
  return db
    .prepare("DELETE FROM reviews WHERE id=?")
    .run(reviewId);
}

export function listReviewsForRestaurant(restaurantId: number) {
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
    .all(restaurantId);
}

export function insertReview(
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