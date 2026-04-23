import { Router } from "express";
import { GAME_CATEGORIES } from "@padplay/shared-types";
import type { GameCategory, PlatformFilter } from "@padplay/shared-types";
import { query, queryOne, toCamel, toCamelRows } from "../lib/db";
import { serializeGame } from "../lib/serialize";

export const gamesRouter = Router();

const GAME_COLUMNS = `
  slug, title, developer, category, platforms, tablet_score,
  price_usd, price_updated_at, short_description, tablet_features,
  app_store_url, play_store_url, thumbnail, icon_url,
  screenshots, quotes,
  ios_rating, ios_rating_count, android_rating, android_rating_count,
  ratings_updated_at, release_year, created_at, updated_at
`;

gamesRouter.get("/", async (req, res, next) => {
  try {
    const categoryParam = typeof req.query.category === "string" ? req.query.category : undefined;
    const platformParam = typeof req.query.platform === "string" ? req.query.platform : undefined;
    const sortParam = typeof req.query.sort === "string" ? req.query.sort : "score";
    const limitParam = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : NaN;
    const offsetParam = typeof req.query.offset === "string" ? parseInt(req.query.offset, 10) : NaN;

    const category: GameCategory | undefined =
      categoryParam && (GAME_CATEGORIES as string[]).includes(categoryParam)
        ? (categoryParam as GameCategory)
        : undefined;

    const platform: PlatformFilter | undefined =
      platformParam === "ios" || platformParam === "android" ? platformParam : undefined;

    const orderBy =
      sortParam === "title" ? "title ASC" : "tablet_score DESC, title ASC";

    const where: string[] = [];
    const filterParams: unknown[] = [];
    if (category) {
      filterParams.push(category);
      where.push(`category = $${filterParams.length}`);
    }
    if (platform === "ios") {
      where.push(`platforms IN ('ios','both')`);
    } else if (platform === "android") {
      where.push(`platforms IN ('android','both')`);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Total count for pagination metadata — respects filters, ignores limit/offset.
    const totalRows = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM games ${whereSql}`,
      filterParams,
    );
    const total = Number(totalRows[0]?.count ?? 0);

    const limit =
      !Number.isNaN(limitParam) && limitParam > 0 && limitParam <= 200
        ? limitParam
        : null;
    const offset =
      !Number.isNaN(offsetParam) && offsetParam > 0 ? offsetParam : 0;

    const params = [...filterParams];
    let paginateSql = "";
    if (limit !== null) {
      params.push(limit);
      paginateSql += ` LIMIT $${params.length}`;
    }
    if (offset > 0) {
      params.push(offset);
      paginateSql += ` OFFSET $${params.length}`;
    }

    const rows = await query<Record<string, unknown>>(
      `SELECT ${GAME_COLUMNS}
         FROM games
         ${whereSql}
         ORDER BY ${orderBy}
         ${paginateSql}`,
      params,
    );

    const camelRows = toCamelRows<any>(rows);
    res.setHeader("X-Total-Count", String(total));
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(camelRows.map(serializeGame));
  } catch (err) {
    next(err);
  }
});

gamesRouter.get("/:slug", async (req, res, next) => {
  try {
    const row = await queryOne<Record<string, unknown>>(
      `SELECT ${GAME_COLUMNS}
         FROM games
        WHERE slug = $1`,
      [req.params.slug],
    );
    if (!row) {
      res.status(404).json({ error: "not_found", message: "Game not found" });
      return;
    }
    const camel = toCamel<any>(row);
    res.json(serializeGame(camel));
  } catch (err) {
    next(err);
  }
});
