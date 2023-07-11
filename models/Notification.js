import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    isLiked: {
        type: Boolean,
        required: false,
    },
    comment: {
        type: String,
        required: false,
    },
    commentedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    reply: {
        type: String,
        required: false,
    },
    repliedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
