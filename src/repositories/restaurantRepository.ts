// src/repositories/restaurantRepo.ts
import db from "../db";

export function listRestaurants(
  whereSql: string,
  params: any[],
  orderSql: string,
  limit: number,
  offset: number
) {
  const total = db
    .prepare(`SELECT COUNT(*) as c FROM restaurants ${whereSql}`)
    .get(...params).c;

  const rows = db
    .prepare(
      `
      SELECT *
      FROM restaurants
      ${whereSql}
      ${orderSql}
      LIMIT ? OFFSET ?
    `
    )
    .all(...params, limit, offset);

  return {
    data: rows,
    pagination: {
      total,
      limit,
      page: offset / limit + 1,
    },
  };
}

export function findRestaurantById(id: number) {
  return db.prepare(`SELECT * FROM restaurants WHERE id=?`).get(id);
}