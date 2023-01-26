const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const argon2 = require("argon2");
require("dotenv").config();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: true,
      message: "Miss username or password",
    });
  }
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User exists in database",
      });
    }
    const hashPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashPassword });

    await newUser.save();

    const accessToken = await jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.send({
      success: true,
      message: "User created successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: true,
      message: "Miss username or password",
    });
  }
  try {
    const user =await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const accessToken = await jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.send({
      success: true,
      message: "User login successfully",
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
