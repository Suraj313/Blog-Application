import express from "express";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";


const allowedOrigins = [
  "https://blog-application-eight-ochre.vercel.app",
  "http://localhost:5173",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Blog API is running" });
});

app.use("/auth", authRoutes);
app.use("/test",testRoutes);
app.use("/categories", categoryRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);


export default app;
