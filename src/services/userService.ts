// src/services/userService.ts
import * as userRepo from "../repositories/userRepository";
import * as reviewRepo from "../repositories/reviewRepository";
import * as favoriteRepo from "../repositories/favoriteRepository";
import * as restaurantRepo from "../repositories/restaurantRepository";

// TYPES
export type UpdateReviewResult =
  | { type: "OK" }
  | { type: "NOT_FOUND" };

export type DeleteReviewResult =
  | { type: "OK" }
  | { type: "NOT_FOUND" };

export type FavoriteResult =
  | { type: "OK" }
  | { type: "RESTAURANT_NOT_FOUND" };

export function getUserById(id: number) {
  return userRepo.findUserById(id);
}

export function listReviewsByUser(userId: number) {
  return reviewRepo.listReviewsByUser(userId);
}

export function updateUserReview(options: {
  reviewId: number;
  userId: number;
  rating: number;
  comment?: string;
}): UpdateReviewResult {
  const existing = reviewRepo.findUserReview(options.reviewId, options.userId);
  if (!existing) return { type: "NOT_FOUND" };

  reviewRepo.updateReview(options.reviewId, options.rating, options.comment);
  return { type: "OK" };
}

export function deleteUserReview(reviewId: number, userId: number): DeleteReviewResult {
  const existing = reviewRepo.findUserReview(reviewId, userId);
  if (!existing) return { type: "NOT_FOUND" };

  reviewRepo.deleteReview(reviewId);
  return { type: "OK" };
}

export function addFavorite(userId: number, restaurantId: number): FavoriteResult {
  const restaurant = restaurantRepo.findRestaurantById(restaurantId);
  if (!restaurant) return { type: "RESTAURANT_NOT_FOUND" };

  favoriteRepo.insertFavorite(userId, restaurantId);
  return { type: "OK" };
}

export function removeFavorite(userId: number, restaurantId: number) {
  favoriteRepo.deleteFavorite(userId, restaurantId);
}

export function listFavoritesByUser(userId: number) {
  return favoriteRepo.listFavoritesByUser(userId);
}