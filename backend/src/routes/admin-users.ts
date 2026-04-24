import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { pool, toCamelRows, toCamel } from "../lib/db";

const grantRoleSchema = z.object({
  email: z.string().email(),
});

const updateRoleSchema = z.object({
  isAdmin: z.boolean(),
});

export async function listAdminUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, wants_updates, is_admin, created_at
         FROM users
        ORDER BY is_admin DESC, created_at ASC, email ASC`,
    );
    res.json({ users: toCamelRows(rows) });
  } catch (err) {
    next(err);
  }
}

export async function grantAdminRole(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = grantRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "bad_request", message: "Invalid email" });
      return;
    }

    const { rows } = await pool.query(
      `UPDATE users
          SET is_admin = true
        WHERE email = $1
      RETURNING id, email, wants_updates, is_admin, created_at`,
      [parsed.data.email.toLowerCase()],
    );

    const user = toCamel(rows[0]);
    if (!user) {
      res.status(404).json({
        error: "not_found",
        message: "User not found. They need to register before you can grant admin access.",
      });
      return;
    }

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminRole(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ error: "bad_request", message: "Invalid user id" });
      return;
    }

    const parsed = updateRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "bad_request", message: "Invalid role payload" });
      return;
    }

    const { rows } = await pool.query(
      `UPDATE users
          SET is_admin = $2
        WHERE id = $1
      RETURNING id, email, wants_updates, is_admin, created_at`,
      [userId, parsed.data.isAdmin],
    );

    const user = toCamel(rows[0]);
    if (!user) {
      res.status(404).json({ error: "not_found", message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function revokeAdminRole(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({ error: "bad_request", message: "Invalid user id" });
      return;
    }

    const { rows } = await pool.query(
      `UPDATE users
          SET is_admin = false
        WHERE id = $1
      RETURNING id, email, wants_updates, is_admin, created_at`,
      [userId],
    );

    const user = toCamel(rows[0]);
    if (!user) {
      res.status(404).json({ error: "not_found", message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
}
