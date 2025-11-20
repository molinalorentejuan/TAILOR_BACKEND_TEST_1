import { injectable } from "tsyringe";
import db from "../db/db";

export interface RestaurantRow {
  id: number;
  name: string;
  cuisine: string | null;
  rating: number;
  neighborhood: string | null;
}

@injectable()
export class RestaurantRepository {
  listRestaurants(
    whereSql: string,
    params: any[],
    orderSql: string,
    limit: number,
    offset: number
  ): {
    data: RestaurantRow[];
    pagination: {
      total: number;
      limit: number;
      page: number;
    };
  } {
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
      .all(...params, limit, offset) as RestaurantRow[];

    return {
      data: rows,
      pagination: {
        total,
        limit,
        page: offset / limit + 1,
      },
    };
  }

  findRestaurantById(id: number): RestaurantRow | undefined {
    return db
      .prepare(`SELECT * FROM restaurants WHERE id=?`)
      .get(id) as RestaurantRow | undefined;
  }
}