import db from "../db";

export function findUserById(id: number) {
  return db
    .prepare("SELECT id, email, role FROM users WHERE id=?")
    .get(id);
}