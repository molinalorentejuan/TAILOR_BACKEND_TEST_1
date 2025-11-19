import db from "../db";

export function countUsers() {
  return db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
}

export function countReviews() {
  return db.prepare("SELECT COUNT(*) AS c FROM reviews").get().c;
}

export function countRestaurants() {
  return db.prepare("SELECT COUNT(*) AS c FROM restaurants").get().c;
}

export function topRated() {
  return db
    .prepare(
      `SELECT * FROM restaurants
       ORDER BY rating DESC
       LIMIT 3`
    )
    .all();
}

export function mostReviewed() {
  return db
    .prepare(
      `SELECT r.id, r.name, COUNT(rv.id) AS reviews
       FROM restaurants r
       LEFT JOIN reviews rv ON rv.restaurantId = r.id
       GROUP BY r.id
       ORDER BY reviews DESC
       LIMIT 3`
    )
    .all();
}