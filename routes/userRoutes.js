const express = require("express");
const { createNewUser, getAllUsers } = require("../controllers/userController");
const router = express.Router();

router.route("/").get(getAllUsers).post(createNewUser);

module.exports = router;
