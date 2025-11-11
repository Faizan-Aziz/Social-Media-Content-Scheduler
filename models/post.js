import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  platforms: {
    type: [String],
    enum: ["Twitter", "Facebook", "Instagram"],
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "scheduled", "published", "failed"],
    default: "scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
export default Post;
