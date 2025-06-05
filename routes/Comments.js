import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

// Get comments for a post
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: 1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a comment to a post
router.post("/posts/:postId/comments", async (req, res) => {
  const { author, text } = req.body;
  if (!text || !author) {
    return res.status(400).json({ error: "Author and text are required" });
  }

  try {
    const newComment = new Comment({
      postId: req.params.postId,
      author,
      text,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

router.get("/:id/comments/count", async (req, res) => {
  try {
    const count = await Comment.countDocuments({ postId: req.params.id });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error counting comments" });
  }
});

export default router;
