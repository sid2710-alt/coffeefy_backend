const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../middleware/jwtToken");
const sendEmail = require("../utils/emailSend");
const crypto = require("crypto");

// register user

//register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "profilepic",
    },
  });

  // const token = user.getJWTToken();

  // res.status(201).json({
  //   success: true,
  //   user,
  // });

  //iski jagh ye use kro

  sendToken(user, 201, res);
});

//user login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }

  // const token = user.getJWTToken();

  // res.status(200).json({
  //   success: true,
  //   user,
  // });

  //iski jagh ye use kro

  sendToken(user, 200, res);
});

// logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logout",
  });
});

//forgot password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset token is : \n\n ${resetPasswordUrl} \n\n if you have not requisted this email please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Bevrages password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("user not found2", 404));
  }
});

//reset password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //create token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //find token user with token

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password Token is invalid or has been expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not matched ", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
