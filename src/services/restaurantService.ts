// src/services/restaurantService.ts
import * as restaurantRepository from "../repositories/restaurantRepository";
import * as reviewRepository from "../repositories/reviewRepository";

export function listRestaurants(filters: {
  page: number;
  limit: number;
  cuisine?: string;
  rating?: number;
  neighborhood?: string;
  sort?: string;
}) {
  const { page, limit, cuisine, rating, neighborhood, sort } = filters;

  const where = [];
  const params: any[] = [];

  if (cuisine) {
    where.push("cuisine=?");
    params.push(cuisine);
  }
  if (rating !== undefined) {
    where.push("rating>=?");
    params.push(rating);
  }
  if (neighborhood) {
    where.push("neighborhood=?");
    params.push(neighborhood);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  let orderSql = "";
  if (sort) {
    const [field, dir] = sort.split(":");
    const safe = ["name", "rating", "cuisine", "neighborhood"].includes(field)
      ? field
      : "name";

    orderSql = `ORDER BY ${safe} ${dir === "desc" ? "DESC" : "ASC"}`;
  }

  const offset = (page - 1) * limit;

  return restaurantRepository.listRestaurants(whereSql, params, orderSql, limit, offset);
}

export function getRestaurantById(id: number) {
  return restaurantRepository.findRestaurantById(id);
}

export function listReviewsForRestaurant(id: number) {
  return reviewRepository.listReviewsForRestaurant(id);
}

export function createReviewForRestaurant({
                                           userId,
                                           restaurantId,
                                           rating,
                                           comment,
                                         }: {
                                           userId: number;
                                           restaurantId: number;
                                           rating: number;
                                           comment: string;
                                         }) {
  const exists = restaurantRepository.findRestaurantById(restaurantId);
  if (!exists) return { type: "RESTAURANT_NOT_FOUND" };

  const info = reviewRepository.insertReview(
    userId,
    restaurantId,
    rating,
    comment
  );

  return { type: "OK", id: info.lastInsertRowid };
}