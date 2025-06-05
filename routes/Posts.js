import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create a new post
router.post("/", async (req, res) => {
  console.log("Incoming POST:", req.body); // Add this

  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error saving post:", err); // And this
    res.status(400).json({ error: "Failed to create post" });
  }
});

router.post("/:postId/upvote", async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.postId);

  if (!post) return res.status(404).send("Post not found");

  const alreadyUpvoted = post.upvotedBy.includes(userId);
  const alreadyDownvoted = post.downvotedBy.includes(userId);

  if (alreadyUpvoted) {
    post.upvotedBy.pull(userId);
    post.upvotes -= 1;
  } else {
    if (alreadyDownvoted) {
      post.downvotedBy.pull(userId);
      post.upvotes += 1;
    }
    post.upvotedBy.push(userId);
    post.upvotes += 1;
  }

  await post.save();
  res.json({ upvotes: post.upvotes, userVote: alreadyUpvoted ? 0 : 1 });
});
  

router.post("/:postId/downvote", async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.postId);

  if (!post) return res.status(404).send("Post not found");

  const alreadyUpvoted = post.upvotedBy.includes(userId);
  const alreadyDownvoted = post.downvotedBy.includes(userId);

  if (alreadyDownvoted) {
    post.downvotedBy.pull(userId);
    post.upvotes += 1;
  } else {
    if (alreadyUpvoted) {
      post.upvotedBy.pull(userId);
      post.upvotes -= 1;
    }
    post.downvotedBy.push(userId);
    post.upvotes -= 1;
  }

  await post.save();
  res.json({ upvotes: post.upvotes, userVote: alreadyDownvoted ? 0 : -1 });
});
  
  

export default router;
