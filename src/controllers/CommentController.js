const commentRouter = require("express").Router();
const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { postId, caption, userId } = req.body;

    const comment = new Comment({
      postId,
      caption,
      userId,
    });

    const savedComment = await comment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ postId }).sort("-createdAt");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeComment = async (req, res) => {
  try {
    const commentId = req.params;

    const comment = await Comment.findOne({
      _id: commentId,
      userId: req.user._id,
    });

    if (!comment) return res.status(404).json({ message: "not found comment" });

    await comment.remove();

    return res.status(200).json({ message: "remove comment successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getCommentsByPost, removeComment };
