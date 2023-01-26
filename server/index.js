const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("./src/routes/auth.js");
const postRouter = require("./src/routes/post.js");

// connect mongodb
const connectDb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://dang:ypEyqjbXSjNIKXLW@learn-fullstack.kvqhton.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", true);
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// router
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
