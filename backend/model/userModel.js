const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");


require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [30, "Name can not be exceed 30 character"],
    minlength: [4, "Name should have more than 4 character"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: [8, "Password should have more than 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
    }, //image host in cloud navi
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//password hashing

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare password after login

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generating Password Reset Token

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
