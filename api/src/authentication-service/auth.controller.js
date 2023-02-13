const asyncHandler = require("express-async-handler");
const User = require("../shared/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login = asyncHandler(async (req, res) => {
  try {
  } catch (error) {}
});

const Register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({ name, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// create a new user 

module.exports = { Login, Register };