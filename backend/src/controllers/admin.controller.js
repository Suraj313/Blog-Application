import Post from "../models/Post.model.js";
import Category from "../models/Category.model.js";
import Comment from "../models/Comment.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: "published" });
    const draftPosts = await Post.countDocuments({ status: "draft" });

    const totalCategories = await Category.countDocuments();

    const totalComments = await Comment.countDocuments();
    const pendingComments = await Comment.countDocuments({
      isApproved: false,
    });

    res.json({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalComments,
      pendingComments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
