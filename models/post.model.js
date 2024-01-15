const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: String,
  body: String,
  device: { type: String, enum: ["Laptop", "Tablet", "Mobile"] },
  no_of_comments: Number,
  userID: String,
});

const PostModel = mongoose.model("Post", postSchema);

module.exports = { PostModel };
