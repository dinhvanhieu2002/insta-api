const jwt = require("jsonwebtoken");

const userModel = require("../models/User");

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      console.log("have token");

      return jwt.verify(token, process.env.TOKEN_SECRET);
    }

    return false;
  } catch (error) {
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) return res.status(401).json({ message: "Unauthorized" });

  const user = await userModel.findById(tokenDecoded.id);

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  req.user = user;

  next();
};

module.exports = { tokenDecode, auth };
