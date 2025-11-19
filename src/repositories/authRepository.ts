import db from "../db";

export interface DBUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

export const authRepository = {
  findUserByEmail(email: string): DBUser | undefined {
    return db
      .prepare("SELECT * FROM users WHERE email=?")
      .get(email) as DBUser | undefined;
  },

  emailExists(email: string): boolean {
    const row = db
      .prepare("SELECT id FROM users WHERE email=?")
      .get(email);
    return !!row;
  },

  createUser(name: string, email: string, hash: string) {
    return db
      .prepare(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
      )
      .run(name, email, hash, "USER");
  },

  findUserBasic(email: string): { id: number; role: "USER" | "ADMIN" } {
    return db
      .prepare("SELECT id, role FROM users WHERE email=?")
      .get(email) as { id: number; role: "USER" | "ADMIN" };
  },
};