import express from "express";
import { getFeedPosts, getUserPosts, likePost, likeComment, likePostCommentReply, commentPost, deletePost, replyPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);

// on his page, only his posts wud be shown
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
// to like and unlike, same as add nd remove friend
router.patch("/:id/like", verifyToken, likePost);

// to like and unlike comment
router.patch("/:id/comment/:commentId/like", verifyToken, likeComment);

// to like and unlike comment
router.patch("/:id/comment/reply/like", verifyToken, likePostCommentReply);

// to comment
router.post("/:id/comment", verifyToken, commentPost);

// to reply a comment
router.post("/:id/comment/reply", verifyToken, replyPost);

// to delete post
router.delete("/:id", verifyToken, deletePost);

export default router;
