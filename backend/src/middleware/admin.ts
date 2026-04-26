import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "./auth";
import { queryOne } from "../lib/db";

/**
 * Admin auth for /api/admin/* routes.
 *
 * Accepts either:
 *   1. A logged-in user whose JWT cookie has isAdmin=true (DB-backed role), OR
 *   2. A shared bearer `ADMIN_TOKEN` via Authorization header, ?token=, or body.token
 *      (legacy fallback for scripts / recovery).
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (await isAdminViaJwt(req)) {
      next();
      return;
    }

    const expected = process.env.ADMIN_TOKEN;
    if (expected) {
      const authHeader = req.headers.authorization ?? "";
      const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
      const queryToken = typeof req.query.token === "string" ? req.query.token : "";
      const bodyToken =
        req.body && typeof req.body.token === "string" ? req.body.token : "";
      const supplied = bearer || queryToken || bodyToken;
      if (supplied && constantTimeEqual(supplied, expected)) {
        next();
        return;
      }
    }

    res.status(401).json({ error: "unauthorized", message: "Admin access required" });
  } catch (err) {
    next(err);
  }
}

async function isAdminViaJwt(req: Request): Promise<boolean> {
  const token = req.cookies?.token;
  if (!token) return false;
  try {
    const secret = process.env.JWT_SECRET || "supersecret123";
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = payload;
    
    const user = await queryOne<{ is_admin: boolean }>(
      `SELECT is_admin FROM users WHERE id = $1`,
      [payload.userId]
    );
    
    if (user?.is_admin === true) {
      return true;
    }
  } catch {
    // fall through
  }
  return false;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
