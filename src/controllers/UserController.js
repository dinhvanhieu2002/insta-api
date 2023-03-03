const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRouter = require("express").Router();
const User = require("../models/User");

const getByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.status(400).json({ message: "User is not exits" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: "username must be unique",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      fullname,
      email,
      avatar:
        "https://res.cloudinary.com/dgvb3ulgi/image/upload/v1673277818/avatars/no-avatar_l8c2wl.png",
      password: passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.TOKEN_SECRET, {
      expiresIn: 60 * 60,
    });

    res.status(200).json({ token, user: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const search = async (req, res) => {
  try {
    const { username } = req.query;

    const users = await User.find({
      username: new RegExp(".*" + username + ".*"),
    });
    if (!users) res.status(400).json({ message: "cannot find user" });

    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ message: "something went wrong!" });
  }
};

const getSuggestedUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    const following = user.following;

    const result = await User.find({}).limit(10);

    const suggestedUser = result
      .filter(
        (profile) => profile.id !== userId && !following.includes(profile.id)
      )
      .splice(0, 5);

    res.status(200).json(suggestedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFollowUser = async (req, res) => {
  try {
    const { userId, followedId } = req.body;

    const user = await User.findById(userId);
    const followedUser = await User.findById(followedId);

    if (user.following.includes(followedId)) {
      user.following = user.following.filter(
        (following) => following.toString() !== followedId
      );
    } else {
      user.following = [followedId, ...user.following];
    }

    if (followedUser.followers.includes(userId)) {
      followedUser.followers = followedUser.followers.filter(
        (follower) => follower.toString() !== userId
      );
    } else {
      followedUser.followers = [userId, ...followedUser.followers];
    }

    await user.save();
    await followedUser.save();

    res.status(200).json({ message: "update successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  signin,
  signup,
  search,
  updateFollowUser,
  getSuggestedUser,
  getByUsername,
};
