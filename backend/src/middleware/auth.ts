import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "unauthorized", message: "Missing authentication token" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "supersecret123";
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "unauthorized", message: "Invalid or expired token" });
  }
}
