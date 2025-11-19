// src/middleware/validate.ts
import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { t } from "../i18n";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: t(req, "INVALID_PAYLOAD"),
        errors: parsed.error.flatten()
      });
    }

    req.body = parsed.data as any;
    next();
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        message: t(req, "INVALID_PAYLOAD"),
        errors: parsed.error.flatten()
      });
    }

    req.query = parsed.data as any;
    next();
  };
}

export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return res.status(400).json({
        message: t(req, "INVALID_PAYLOAD"),
        errors: parsed.error.flatten()
      });
    }

    req.params = parsed.data as any;
    next();
  };
}