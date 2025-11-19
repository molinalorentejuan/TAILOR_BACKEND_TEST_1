// src/services/authService.ts
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { authRepository } from "../repositories/authRepository";

export type RegisterResult =
  | { type: "EMAIL_IN_USE" }
  | { type: "OK"; token: string };

export type LoginResult =
  | { type: "INVALID_CREDENTIALS" }
  | {
      type: "OK";
      token: string;
      user: { id: number; email: string; role: "USER" | "ADMIN" };
    };

/**
 * Registra un usuario.
 */
export function registerUser(
  email: string,
  password: string,
  name: string
): RegisterResult {
  if (authRepository.emailExists(email)) {
    return { type: "EMAIL_IN_USE" };
  }

  const hash = bcrypt.hashSync(password, 10);

  const finalName =
    name && name.trim().length > 0
      ? name.trim()
      : email.split("@")[0] || "User";

  authRepository.createUser(finalName, email, hash);

  const user = authRepository.findUserBasic(email);

  const token = signToken({ id: user.id, role: user.role });

  return { type: "OK", token };
}

/**
 * Login: devuelve token + user
 */
export function loginUser(email: string, password: string): LoginResult {
  const user = authRepository.findUserByEmail(email);

  if (!user) {
    return { type: "INVALID_CREDENTIALS" };
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return { type: "INVALID_CREDENTIALS" };
  }

  const token = signToken({ id: user.id, role: user.role });

  return {
    type: "OK",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}