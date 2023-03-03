const uploadPost = (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.status(200).json({ secure_url: req.file.path });
};

const uploadAvatar = (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.status(200).json({ secure_url: req.file.path });
};
module.exports = { uploadAvatar, uploadPost };
