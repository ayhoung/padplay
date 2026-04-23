import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { gamesRouter } from "./routes/games";
import { categoriesRouter } from "./routes/categories";
import { errorHandler, notFoundHandler } from "./middleware/errors";

const app = express();
const PORT = Number(process.env.PORT ?? 6004);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:6003";

app.use(cors({ origin: CORS_ORIGIN.split(",").map((s) => s.trim()) }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/games", gamesRouter);
app.use("/api/categories", categoriesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 backend listening on http://localhost:${PORT}`);
});
