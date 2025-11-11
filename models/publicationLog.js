// models/publicationLog.js
import mongoose from "mongoose";

const PublicationLogSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success"
    },
    note: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const PublicationLog = mongoose.model("PublicationLog", PublicationLogSchema);

export default PublicationLog;
