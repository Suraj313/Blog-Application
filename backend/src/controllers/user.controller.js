import User from "../models/User.model.js";
import Post from "../models/Post.model.js"; 
import fs from "fs";
import path from "path";


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalPosts = await Post.countDocuments({
      author: req.user._id,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || null,
      totalPosts, 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage) {
      const oldImagePath = path.join(
        process.cwd(),
        user.profileImage.replace("/", "")
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.profileImage) {
      return res
        .status(400)
        .json({ message: "No profile image to remove" });
    }

    const imagePath = path.join(
      process.cwd(),
      user.profileImage.replace("/", "")
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    user.profileImage = null;
    await user.save();

    res.status(200).json({
      message: "Profile image removed successfully",
      profileImage: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};