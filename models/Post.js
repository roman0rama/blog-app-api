//Creating user model for MVC

import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: Array,
        default: []
    },
    viewCount: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageURL: String
}, {
    //Auto generating date of creating & updating
    timestamps: true
})

export default mongoose.model('Post', PostSchema)