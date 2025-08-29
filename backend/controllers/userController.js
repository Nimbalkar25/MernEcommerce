// Importing necessary utilities and dependencies
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken"); // Utility to send JWT in cookie
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("../utils/cloudinary.jsx"); // Cloudinary config

//Register our user

// ✅ Controller: Register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  // Extracting data from request body
  const { name, email, password } = req.body;

  // 🔐 Validate: Check if avatar file was uploaded
  if (!req.file) {
    return next(new ErrorHandler("Please upload an avatar", 400));
  }

  // ✅ Upload avatar to Cloudinary using a memory buffer (from multer)
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars", // Store inside a folder on Cloudinary
      },
      (error, result) => {
        if (error) return reject(error); // Reject on failure
        resolve(result); // Resolve with the uploaded file info
      }
    );
    stream.end(req.file.buffer); // Send the file buffer to Cloudinary stream
  });

  // ✅ Save new user to MongoDB
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id, // From Cloudinary response
      url: result.secure_url,      // Accessible image URL
    },
  });

  // ✅ Send token as cookie + response
  sendToken(user, 201, res);
});


// ✅ Controller: Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for missing credentials
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password both", 400));
  }

  // Find user by email and explicitly select password (as it's usually hidden)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid username or password!!", 401));
  }

  // Compare hashed password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid username or password!!", 401));
  }
  
  // Send JWT cookie + user
  sendToken(user, 201, res);
});

// ✅ Controller: Logout user
exports.logOut = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// ✅ Controller: Forgot Password
exports.forgotpassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  // Generate reset token and save in DB
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Build reset URL
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const message = `Your password reset token is tempp:\n\n${resetPasswordurl}\n\nIf not requested, ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// ✅ Controller: Reset Password using token
exports.resetpassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Check if token still valid
  });

  if (!user) {
    return next(new ErrorHandler("Token expired or invalid", 400));
  }

  // Check new password match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// ✅ Controller: Get own profile info
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// ✅ Controller: Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

    if (!user || !user.password) {
    return next(new ErrorHandler("User not found or password missing", 404));
  }

  const isPasswordMatched = await user.comparePassword(req.body.oldpassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect!", 401));
  }

  if (req.body.newpassword !== req.body.confirmpassword) {
    return next(new ErrorHandler("Passwords do not match!", 401));
  }

  user.password = req.body.newpassword;
  await user.save();

  sendToken(user, 200, res);
});

// ✅ Controller: Update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.file) {
    const user = await User.findById(req.user.id);

    // Delete old avatar from Cloudinary
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Use upload_stream for in-memory file
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            resource_type: "image",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.file.buffer);
      });

    try {
      const result = await streamUpload();
      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (err) {
      return next(new ErrorHandler("Avatar upload failed", 500));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({ success: true, user: updatedUser });
});




// ✅ Controller: Admin - Get All Users
exports.getAllusers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// ✅ Controller: Admin - Get single user by ID
exports.getSingleuser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found with ID: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// ✅ Controller: Admin - Update another user's role/info
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    // Avatar update via cloudinary (optional)
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({ success: true });
});

// ✅ Controller: Admin - Delete user
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User not found with ID: ${req.params.id}`));
  }

  // Optional: delete user image from cloudinary here if implemented

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
