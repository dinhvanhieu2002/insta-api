const router = require("express").Router();
const postController = require("../controllers/PostController");
const tokenMiddleware = require("../middlewares/tokenMiddleware");
const { body } = require("express-validator");

router.post(
  "/",
  tokenMiddleware.auth,
  body("userId")
    .exists()
    .withMessage("userId is required")
    .isLength({ min: 1 })
    .withMessage("postId cannot be empty"),
  body("caption")
    .exists()
    .withMessage("caption is required")
    .isLength({ min: 1 })
    .withMessage("caption cannot be empty"),
  body("photo")
    .exists()
    .withMessage("photo is required")
    .isLength({ min: 1 })
    .withMessage("photo cannot be empty"),
  postController.addPost
);
router.get("/", tokenMiddleware.auth, postController.getPostsOfUser);
router.get(
  "/following",
  tokenMiddleware.auth,
  postController.getPostsOfFollowing
);
router.post("/:postId/like", tokenMiddleware.auth, postController.likePost);

module.exports = router;
