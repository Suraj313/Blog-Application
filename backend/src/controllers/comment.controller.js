import Comment from "../models/Comment.model.js";

export const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!postId || !text) {
      return res.status(400).json({ message: "Post ID and text are required" });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      text,
    });

    res.status(201).json({
      message: "Comment added and pending approval",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post: postId,
      isApproved: true,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isApproved = true;
    await comment.save();

    res.json({ message: "Comment approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name email")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

