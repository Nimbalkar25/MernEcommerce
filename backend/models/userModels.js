// bcryptjs	Hash & compare passwords for security 🔒
// jsonwebtoken	Generate & verify JWT tokens for authentication 🔑
// validator	Validate user input (emails, passwords, etc.) ✅
// nodemailer	Send emails (account verification, password reset) 📧
// cookie-parser	Read & write cookies for user sessions 🍪
// body-parser	Parse JSON and form data from requests 📜

const mongoose = require("mongoose");
const { type } = require("os");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [30, "Name cannot exceeds greater than 30 char"],
    minLength: [4, "Name should atleast greater than 4 char"],
  },
  email: {
    type: String,
    required: [true, "Please enter email!!.."],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email id!!.."],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minLength: [8, "Password should be greater than 8 char"],
    // select false means in db if u find for user pass u will not get
    // otherwise each data u can extract using find
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpire: {
    type: Date,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating  password reset token
userSchema.methods.getResetPasswordToken = function () {
  //generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
