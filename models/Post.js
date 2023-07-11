import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: {
            type: String,
            default: null,
        },
        clipPath: {
            type: String,
            default: null,
        },
        attachmentPath: {
            type: String,
            default: null,
        },
        audioPath: {
            type: String,
            default: null,
        },
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: [
            {
                userId: {
                    type: String,
                    required: true,
                },
                firstName: {
                    type: String,
                    required: true,
                },
                lastName: {
                    type: String,
                    required: true,
                },
                userPicturePath: String,
                comment: {
                    type: String,
                    required: true,
                },
                likes: {
                    type: Map,
                    of: Boolean,
                },
                reply: [
                    {
                        userId: {
                            type: String,
                            required: true,
                        },
                        firstName: {
                            type: String,
                            required: true,
                        },
                        lastName: {
                            type: String,
                            required: true,
                        },
                        userPicturePath: String,
                        comment: {
                            type: String,
                            required: true,
                        },
                        likes: {
                            type: Map,
                            of: Boolean,
                        },
                    }
                ],
            }
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
