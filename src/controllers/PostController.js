const Post = require("../models/Post");
const User = require("../models/User");

const addPost = async (req, res) => {
  try {
    const { caption, photo, userId } = req.body;

    const newPost = new Post({
      caption,
      photo,
      userId,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      _id: postId,
      userId: req.user._id,
    });

    if (!post) return res.status(404).json({ message: "not found post" });

    await post.remove();

    return res.status(200).json({ message: "remove post successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPostsOfUser = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id });

    res.json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPostsOfFollowing = async (req, res) => {
  try {
    const posts = await Post.find({ userId: { $in: req.user.following } }).sort(
      "-createdAt"
    );

    if (!posts) res.status(204).json({ message: "no post was gotten" });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const loggedUser = req.user._id;
    let message;

    const post = await Post.findById(postId);

    if (post.reactions.includes(loggedUser)) {
      post.reactions = post.reactions.filter(
        (reaction) => reaction.toString() !== loggedUser
      );
      message = "unliked post";
    } else {
      post.reactions = [loggedUser, ...post.reactions];
      message = "liked post";
    }

    await post.save();

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPost,
  removePost,
  getPostsOfFollowing,
  getPostsOfUser,
  likePost,
};
