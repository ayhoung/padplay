import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { gamesRouter } from "./routes/games";
import { categoriesRouter } from "./routes/categories";
import {
  submissionsRouter,
  listSubmissions,
  approveSubmission,
  rejectSubmission,
} from "./routes/submissions";
import {
  listAdminUsers,
  grantAdminRole,
  updateAdminRole,
  revokeAdminRole,
} from "./routes/admin-users";
import { requireAdmin } from "./middleware/admin";
import { errorHandler, notFoundHandler } from "./middleware/errors";

const app = express();
const PORT = Number(process.env.PORT ?? 6004);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:6003";

app.set("trust proxy", true); // behind nginx — honor X-Forwarded-For for rate limiting
app.use(cors({ 
  origin: CORS_ORIGIN.split(",").map((s) => s.trim()),
  credentials: true 
}));
app.use(express.json({ limit: "64kb" }));
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/submissions", submissionsRouter);

// Admin routes — all gated by requireAdmin
const adminRouter = express.Router();
adminRouter.use(requireAdmin);
adminRouter.get("/submissions", listSubmissions);
adminRouter.post("/submissions/:id/approve", approveSubmission);
adminRouter.post("/submissions/:id/reject", rejectSubmission);
adminRouter.get("/users", listAdminUsers);
adminRouter.post("/users/roles", grantAdminRole);
adminRouter.patch("/users/:id/role", updateAdminRole);
adminRouter.delete("/users/:id/role", revokeAdminRole);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 backend listening on http://localhost:${PORT}`);
});
