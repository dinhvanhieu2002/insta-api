const express = require("express");

const userRouter = require("./user");
const uploadRouter = require("./upload");
const commentRouter = require("./comment");
const messageRouter = require("./message");
const conversationRouter = require("./conversation");
const postRouter = require("./post");

const router = express.Router();

router.use("/users", userRouter);
router.use("/upload", uploadRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/conversations", conversationRouter);
router.use("/messages", messageRouter);

module.exports = router;
