import type { NextFunction, Request, Response } from "express";

/**
 * Simple bearer-token auth for /api/admin/* routes.
 * Configured via ADMIN_TOKEN env var on the server.
 * Token may be supplied as `Authorization: Bearer <token>` header
 * or `?token=<token>` query param (for form-based admin UIs).
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    res.status(503).json({
      error: "admin_not_configured",
      message: "ADMIN_TOKEN not set on server",
    });
    return;
  }

  const authHeader = req.headers.authorization ?? "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const queryToken = typeof req.query.token === "string" ? req.query.token : "";
  const bodyToken =
    req.body && typeof req.body.token === "string" ? req.body.token : "";
  const supplied = bearer || queryToken || bodyToken;

  if (!supplied || !constantTimeEqual(supplied, expected)) {
    res.status(401).json({ error: "unauthorized", message: "Bad admin token" });
    return;
  }
  next();
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
