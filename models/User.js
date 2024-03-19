//Creating user model for MVC

import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    userAvatar: String
}, {
    //Auto generating date of creating & updating
    timestamps: true
})

export default mongoose.model('User', UserSchema)