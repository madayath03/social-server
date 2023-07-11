import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// read is part of crud.. create read update delete
// this id comes after /users, see index js
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// to update
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
