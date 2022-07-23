const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel.js");

const secret = "auth";

// sign up
const signUp = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const result = new UserModel({
      email: email,
      username: username,
      password: hashedPassword,
    });

    await result.save();

    const token = jwt.sign({ id: result._id }, secret, {
      expiresIn: "1h",
    });
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// sign in
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: existingUser._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// update
const update = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    // authenticate

    // update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: update,
      },
      { new: true }
    );

    // new token
    const token = jwt.sign(
      { email: updatedUser.email, id: updatedUser._id },
      secret,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ result: updatedUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signUp, signIn, update };
