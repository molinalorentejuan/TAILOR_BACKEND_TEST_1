// src/repositories/restaurantAdminRepository.ts
import db from '../db';

export const restaurantAdminRepository = {
  insertRestaurant(name: string, cuisine: string | null, rating: number, neighborhood: string | null) {
    const info = db.prepare(
      `
      INSERT INTO restaurants (name, cuisine, rating, neighborhood)
      VALUES (?, ?, ?, ?)
    `
    ).run(name, cuisine, rating, neighborhood);

    return Number(info.lastInsertRowid);
  },

  restaurantExists(id: number): boolean {
    const row = db.prepare('SELECT id FROM restaurants WHERE id=?').get(id);
    return !!row;
  },

  updateRestaurant(
    id: number,
    name: string | null,
    cuisine: string | null,
    rating: number | null,
    neighborhood: string | null
  ) {
    db.prepare(
      `
        UPDATE restaurants SET
          name = COALESCE(?, name),
          cuisine = COALESCE(?, cuisine),
          rating = COALESCE(?, rating),
          neighborhood = COALESCE(?, neighborhood)
        WHERE id=?
      `
    ).run(name, cuisine, rating, neighborhood, id);
  },

  deleteRestaurant(id: number) {
    db.prepare('DELETE FROM restaurants WHERE id=?').run(id);
  },
};