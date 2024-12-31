import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
const POSTS_FILE = path.join(__dirname, "data", "posts.json");

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Helper function to read posts
async function readPosts() {
  try {
    const data = await fs.readFile(POSTS_FILE, "utf8");
    console.log("Read posts:", data); // Debug log
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading posts:", error); // Debug log
    return [];
  }
}

// Helper function to write posts
async function writePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    console.log("GET /api/posts called"); // Debug log
    const posts = await readPosts();
    console.log("Sending posts:", posts); // Debug log
    res.json(posts);
  } catch (error) {
    console.error("Error in GET /api/posts:", error); // Debug log
    res.status(500).json({ error: "Failed to retrieve posts" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const posts = await readPosts();
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost);
    await writePosts(posts);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Delete a post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await readPosts();
    const filteredPosts = posts.filter((post) => post.id !== id);

    if (posts.length === filteredPosts.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    await writePosts(filteredPosts);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Posts file location:", POSTS_FILE); // Debug log
});
