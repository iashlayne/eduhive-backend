import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/Posts.js";
import authRoutes from "./routes/UserAuth.js";
import commentRoutes from "./routes/Comments.js";

dotenv.config();
console.log("JWT_SECRET from env:", process.env.JWTSECRET);

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "build")));

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5000", "https://eduhive-s4wm.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
  

mongoose
  .connect(process.env.EDUHIVEDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

app.listen(PORT, () => {
  console.log(
    `🚀 Server is running at https://eduhive-s4wm.onrender.com${PORT}`
  );
});
