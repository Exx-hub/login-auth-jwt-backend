const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");

  if (!users) {
    return res.status(400).json({ message: "No users found!" });
  }

  res.status(200).json({ data: users });
};

const createNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const userExist = await User.findOne({ username }).lean().exec();

  if (userExist) {
    return res.status(409).json({ message: "Username already exists." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  let newUser = {
    username,
    password: hashedPassword,
  };

  try {
    await User.create(newUser);
    res.status(201).json({ message: `Success! ${username} created.` });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

module.exports = { createNewUser, getAllUsers };
