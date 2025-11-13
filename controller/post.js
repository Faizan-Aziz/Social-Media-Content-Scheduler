import Post from "../models/post.js";

// 🟢 Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, platforms, scheduledAt, imageUrl } = req.body;

    if (!content || !platforms || !scheduledAt) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // scheduledAt is already in UTC from frontend
    const newPost = new Post({
      user: req.userID,
      content,
      platforms,
      scheduledAt: new Date(scheduledAt),
      imageUrl,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🟢 Get all posts with pagination - SHOW NEAREST SCHEDULED FIRST
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // ✅ BUILD QUERY WITH OPTIONAL STATUS FILTER
    let query = { user: req.userID };
    if (status && status !== "all") {
      query.status = status;
    }

    const posts = await Post.find(query)
      .sort({ scheduledAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Post.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ message: "Post not found" });

    // post.user = User ID who created the post (from database)
    // req.userID = Currently logged-in user's ID (from JWT token)

    if (post.user.toString() !== req.userID) return res.status(403).json({ message: "Forbidden" });
    res.json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



// Edit post
export const updatePost = async (req, res) => {
  try {
    const { content, platforms, scheduledAt, imageUrl, status } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.userID)
      return res.status(403).json({ message: "Forbidden" });
    if (post.status === "published")
      return res.status(400).json({ message: "Cannot edit published post" });

    if (scheduledAt && new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({ message: "scheduledAt must be a future date" });
    }

    post.content = content ?? post.content;
    post.platforms = platforms ?? post.platforms;
    if (scheduledAt) post.scheduledAt = new Date(scheduledAt);
    post.imageUrl = imageUrl ?? post.imageUrl;
    if (status) post.status = status;

    await post.save();
    res.json({ message: "Post updated", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.userID) return res.status(403).json({ message: "Forbidden" });
    if (post.status === "published") return res.status(400).json({ message: "Cannot delete published post" });

    // ✅ FIX: Use findByIdAndDelete instead of post.remove()
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
