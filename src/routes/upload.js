const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { uploadPostCloud, uploadAvatarCloud } = require("../../cloudinary");

const tokenMiddleware = require("../middlewares/tokenMiddleware");
const UploadController = require("../controllers/UploadController");

router.post(
  "/post",
  tokenMiddleware.auth,
  uploadPostCloud.single("file"),
  UploadController.uploadPost
);
router.post(
  "/avatar",
  tokenMiddleware.auth,
  uploadAvatarCloud.single("file"),
  UploadController.uploadAvatar
);

module.exports = router;
