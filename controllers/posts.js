import Notification from "../models/Notification.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, fileType } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            likes: {},
            comments: [],
        });
        if (fileType === 'picture') {
            const { picturePath } = req.body;
            newPost.picturePath = picturePath;
        } else if (fileType === 'clip') {
            const { clipPath } = req.body;
            newPost.clipPath = clipPath;
        } else if (fileType === 'attachment') {
            const { attachmentPath } = req.body;
            newPost.attachmentPath = attachmentPath;
        } else if (fileType === 'audio') {
            const { audioPath } = req.body;
            newPost.audioPath = audioPath;
        }
        await newPost.save();

        const post = await Post.find().sort({ _id: -1 });
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const search = req.query.search;
        let query = {};

        if (search) {
            query = {
                description: { $regex: search, $options: "i" },
            };
        }

        const posts = await Post.find(query).sort({ _id: -1 });
        // console.log(posts);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const search = req.query.search;
        const { userId } = req.params;

        let query = { userId };

        if (search) {
            query.description = { $regex: search, $options: "i" };
        }

        const post = await Post.find(query).sort({ _id: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const likePostComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, commentId } = req.body;
        // const post = await Post.find({
        //     comments: { $elemMatch: { _id : commentId } }
        // });
        // const comment1 = post.comments.map((item)=>{item._id == commentId})
        // console.log(userId, commentId);
        const post = await Post.findById(id);
        console.log(post);
        const isLiked = post.comments.likes.get(userId);
        console.log(isLiked);
        // if (isLiked) {
        //     post.comments.likes.delete(userId);
        // } else {
        //     post.comments.likes.set(userId, true);
        // }

        // const updatedPost = await Post.findByIdAndUpdate(
        //     id,
        //     { likes: post.comments.likes },
        //     { new: true }
        // );
        
        // res.status(200).json(updatedPost);
        res.status(200).json({ message: "200" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const likeComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);

        const comment = post.comments.find((c) => c._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const isLiked = comment.likes.get(userId);

        if (isLiked) {
            comment.likes.delete(userId);
        } else {
            comment.likes.set(userId, true);
        }

        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const likePostCommentReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.comments.reply.likes.get(userId);

        if (isLiked) {
            post.comments.reply.likes.delete(userId);
        } else {
            post.comments.reply.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.comments.reply.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, comment } = req.body;

        const post = await Post.findById(id);

        // Fetch user details who is commenting from the database
        const user = await User.findById(userId);

        // Create a comment object with user details
        const newComment = {
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userPicturePath: user.picturePath,
            comment,
            likes: {},
            reply: [],
        };

        // Add the new comment to the comments array
        post.comments.push(newComment);

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { comments: post.comments },
            { new: true }
        );

        // Create a comment notification
        // const notification = new Notification({
        //     userId: post.userId,
        //     postId: id,
        //     comment: comment,
        //     commentedUserId: userId
        // });
        // await notification.save();

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const replyPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, reply } = req.body;

        const post = await Post.findById(id);

        // Fetch user details who is commenting from the database
        const user = await User.findById(userId);

        // Create a comment object with user details
        const newComment = {
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            userPicturePath: user.picturePath,
            comment : reply,
            likes: {},
        };

        // Add the new reply to the reply array
        post.comments.reply.push(newComment);

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { comments : { reply: post.comments.reply } },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        // await Notification.findByIdAndDelete({ postId : id})
        await Post.findByIdAndDelete(id);
        const post = await Post.find().sort({ _id: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

