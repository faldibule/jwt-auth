const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body:{
        type: String,
    },
    createdAt:{
        type: Date,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }
})

const Comment = mongoose.model('comment', commentSchema)
module.exports = Comment;