const router = require("express").Router();
const commentController = require("../controllers/CommentController");
const tokenMiddleware = require("../middlewares/tokenMiddleware");
const { body } = require("express-validator");
router.post(
  "/",
  tokenMiddleware.auth,
  body("postId")
    .exists()
    .withMessage("postId is required")
    .isLength({ min: 1 })
    .withMessage("postId cannot be empty"),
  body("caption")
    .exists()
    .withMessage("caption is required")
    .isLength({ min: 1 })
    .withMessage("caption cannot be empty"),
  body("userId")
    .exists()
    .withMessage("userId is required")
    .isLength({ min: 1 })
    .withMessage("userId cannot be empty"),
  commentController.addComment
);
router.get(
  "/:postId",
  tokenMiddleware.auth,
  commentController.getCommentsByPost
);
router.delete(
  "/:commentId",
  tokenMiddleware.auth,
  commentController.removeComment
);
module.exports = router;
