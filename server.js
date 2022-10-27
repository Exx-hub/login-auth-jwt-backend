require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");

const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT;

connectDB();

const rootRoute = require("./routes/rootRoute");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// build in middlewares
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));

// thirdparty middleware
app.use(cors(corsOptions));
app.use(cookieParser());

// app routes
app.use("/", rootRoute);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// catch all route that do not match or not routed properly / 404 page
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found!" });
  } else {
    res.type("txt").send("404 Not Found!");
  }
});

const db = mongoose.connection;

db.once("open", () => {
  console.log(process.env.NODE_ENV);
  console.log("DB connection Established");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
