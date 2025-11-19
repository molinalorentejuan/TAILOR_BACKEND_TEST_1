import db from "../db";

export function insertFavorite(userId: number, restaurantId: number): "OK" | "DUPLICATE" {
  try {
    db.prepare(
      "INSERT INTO favorites (userId, restaurantId) VALUES (?, ?)"
    ).run(userId, restaurantId);
    return "OK";
  } catch (err: any) {
    if (String(err).includes("UNIQUE")) return "DUPLICATE";
    throw err;
  }
}

export function deleteFavorite(userId: number, restaurantId: number) {
  return db
    .prepare("DELETE FROM favorites WHERE userId=? AND restaurantId=?")
    .run(userId, restaurantId);
}

export function listFavoritesByUser(userId: number) {
  return db
    .prepare(
      `
      SELECT r.*
      FROM favorites f
      JOIN restaurants r ON r.id = f.restaurantId
      WHERE f.userId=?
    `
    )
    .all(userId);
}