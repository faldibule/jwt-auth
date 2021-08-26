const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
  },
  image_id: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

const Post = mongoose.model("post", postSchema);
module.exports = Post;
