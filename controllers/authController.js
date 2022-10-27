const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and Password required." });
  }

  const user = await User.findOne({ username }).exec();

  if (!user) {
    return res.status(403).json({ message: "Username not found." });
  }

  const validatePassword = bcrypt.compareSync(password, user.password);

  if (!validatePassword) {
    return res.status(403).json({ message: "Incorrect password." });
  }

  const accessToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // create secure cookie with refresh token and sent along with the response
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "None", // // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry set to match refresh token expiry
  });

  res.status(200).json({ message: "login success!", token: accessToken });
};

module.exports = { login };
