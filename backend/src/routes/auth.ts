import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { queryOne, pool } from "../lib/db";
import { requireUser } from "../middleware/auth";

export const authRouter = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  wantsUpdates: z.boolean().default(true),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "bad_request", message: "Invalid input data", details: parsed.error.issues });
      return;
    }
    const { email, password, wantsUpdates } = parsed.data;

    const existingUser = await queryOne(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser) {
      res.status(409).json({ error: "conflict", message: "User with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = await queryOne<{ id: number; email: string; wants_updates: boolean }>(
      `INSERT INTO users (email, password_hash, wants_updates) VALUES ($1, $2, $3) RETURNING id, email, wants_updates`,
      [email, passwordHash, wantsUpdates]
    );

    if (!newUser) throw new Error("Failed to insert user");

    const secret = process.env.JWT_SECRET || "supersecret123";
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, secret, { expiresIn: "30d" });

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ user: { id: newUser.id, email: newUser.email, wantsUpdates: newUser.wants_updates } });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "bad_request", message: "Invalid input data" });
      return;
    }
    const { email, password } = parsed.data;

    const user = await queryOne<{ id: number; email: string; password_hash: string; wants_updates: boolean }>(
      `SELECT id, email, password_hash, wants_updates FROM users WHERE email = $1`,
      [email]
    );

    if (!user) {
      res.status(401).json({ error: "unauthorized", message: "Invalid email or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: "unauthorized", message: "Invalid email or password" });
      return;
    }

    const secret = process.env.JWT_SECRET || "supersecret123";
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "30d" });

    res.cookie("token", token, cookieOptions);
    res.json({ user: { id: user.id, email: user.email, wantsUpdates: user.wants_updates } });
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

authRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
      return;
    }

    const user = await queryOne<{ id: number; email: string; wants_updates: boolean }>(
      `SELECT id, email, wants_updates FROM users WHERE id = $1`,
      [userId]
    );

    if (!user) {
      res.status(404).json({ error: "not_found", message: "User not found" });
      return;
    }

    res.json({ user: { id: user.id, email: user.email, wantsUpdates: user.wants_updates } });
  } catch (err) {
    next(err);
  }
});
