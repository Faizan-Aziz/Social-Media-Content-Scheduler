import cron from "node-cron";
import Post from "../models/post.js";
import PublicationLog from "../models/publicationLog.js";

export const startPublisher = () => {
  // run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      // find scheduled posts whose scheduledAt <= now, ordered by scheduledAt then createdAt
      const posts = await Post.find({
        status: "scheduled",
        scheduledAt: { $lte: now }
      }).sort({ scheduledAt: 1, createdAt: 1 }).limit(100);

      for (const post of posts) {
        try {
          post.status = "published";
          post.publishedAt = new Date();
          await post.save();

          await PublicationLog.create({
            post: post._id,
            user: post.user,
            publishedAt: post.publishedAt,
            status: "success",
            note: "Published by scheduler"
          });
        } catch (innerErr) {
          console.error("Error publishing post", post._id, innerErr);
          await PublicationLog.create({
            post: post._id,
            user: post.user,
            publishedAt: new Date(),
            status: "failed",
            note: innerErr.message
          });
          post.status = "failed";
          await post.save();
        }
      }
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });
};
