import { Router } from "express";
import { query } from "../lib/db";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await query<{ category: string; count: string }>(
      `SELECT category, COUNT(*)::text AS count
         FROM games
        GROUP BY category
        ORDER BY category ASC`,
    );
    res.json(rows.map((r) => ({ category: r.category, count: Number(r.count) })));
  } catch (err) {
    next(err);
  }
});
