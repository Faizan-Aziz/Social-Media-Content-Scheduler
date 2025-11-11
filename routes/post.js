
import express from "express";
import { createPost, getAllPosts, getPost, updatePost, deletePost } from "../controller/post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createPost);
router.get("/", auth, getAllPosts);
router.get("/:id", auth, getPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

export default router;
