const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image:{
    type: String,
  },
  image_id:{
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
