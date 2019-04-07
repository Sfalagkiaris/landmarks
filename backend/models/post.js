const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  short_info: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: false },
  description: { type: String, required: false },
  created_at: { type: String, required: false },
  updated_at: { type: String, required: false },
});

module.exports = mongoose.model("Post", postSchema);
