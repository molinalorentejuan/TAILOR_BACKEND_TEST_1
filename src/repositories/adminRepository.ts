// src/repositories/adminRepository.ts
import db from '../db';

export const adminRepository = {
  getStats: () => {
      const users = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
      const restaurants = db.prepare("SELECT COUNT(*) as count FROM restaurants").get().count;
      const reviews = db.prepare("SELECT COUNT(*) as count FROM reviews").get().count;

      return { users, restaurants, reviews };
    },
  countUsers() {
    return (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
  },

  countReviews() {
    return (db.prepare('SELECT COUNT(*) as c FROM reviews').get() as any).c;
  },

  countRestaurants() {
    return (db.prepare('SELECT COUNT(*) as c FROM restaurants').get() as any).c;
  },

  getTopRated() {
    return db
      .prepare('SELECT * FROM restaurants ORDER BY rating DESC LIMIT 3')
      .all();
  },

  getMostReviewed() {
    return db
      .prepare(
        `
        SELECT r.id, r.name, COUNT(rv.id) as reviews
        FROM restaurants r
        LEFT JOIN reviews rv ON rv.restaurantId = r.id
        GROUP BY r.id, r.name
        ORDER BY reviews DESC
        LIMIT 3
      `
      )
      .all();
  },
};