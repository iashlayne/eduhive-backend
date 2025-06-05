import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import postRoutes from "./routes/Posts.js";
import authRoutes from "./routes/UserAuth.js";
import commentRoutes from "./routes/Comments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files if needed
app.use(express.static(path.join(__dirname, "build"))); // optional if you serve a React frontend

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local frontend
      "https://eduhive-frontend.onrender.com", // Replace with actual frontend deployment
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.EDUHIVEDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Fallback for client-side routing (React)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on: https://eduhive-backend-42tt.onrender.com`);
});
