const TryAndCAtch = require("../utilitis/tryAndCatch");
const users = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const AppError = require("../utilitis/appError");
const sendEmail = require("../utilitis/emailer");

const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = TryAndCAtch(async (req, res, next) => {
  req.body.creationAt = new Date()
  const createuser = await users.create(req.body);
  // const token = jwt.sign({id:createuser._id },process.env.JWT_SECRETKEY,{expiresIn:process.env.JWT_EXPIRES_IN})
  const token = signToken(createuser._id);
  res.status(201).json({
    status: "success",
    message: "your create a account sucessful ",
    data: createuser,
    token,
  });
});
exports.login = TryAndCAtch(async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await users.findOne({ email });
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError("please enter valid email and password", 400));
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } else {
    return next(new AppError("plese provide email and password to login", 400));
  }
});
exports.forgetPassword = TryAndCAtch(async (req, res, next) => {
  const { email } = req.body;
  const user = await users.findOne({ email });

  if (user) {
    const resetToken = user.createpasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // res.status(201).json({
    //     status: 'sucess',
    //     resetToken,
    // })

    console.log(resetToken);
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetpassword/${resetToken}`;
    const message = `    hello from ${req.get("host")} \n
                         you are reciving this e-mail because you are someone elsehas requested apassword for your account.however,we dont have any record of a user  with email inbaa2687w46@gmail.com in our database.\n\n
                         this mail is safely ignored if you didnot request a password reset.\n
                         If it was you,you can sign up for account using this link as below\n
                         ${resetUrl}\n
                         tankyou for using this ${req.get("host")}\n
                         ${req.get("host")}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "your password reset token valid for 10 min only",
        message: message,
      });
      res.status(200).json({
        status: "success",
        message: "your reset passord link is send to your email",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpiresIn = undefined;
    }
  } else {
    return next(
      new AppError(
        "your information is incorrect for reset password.please give the correct information ",
        401
      )
    );
  }
});
exports.resetPassword = TryAndCAtch(async (req, res, next) => {
  console.log(req.params.token);

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Invalid token or token expiered", 400));
  }
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;

  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = TryAndCAtch(async (req, res, next) => {
  const user = await users.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentpassword, user.password))) {
    return next(new AppError("you current password is wrong", 401));
  }

  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.getUser = TryAndCAtch(async (req, res, next) => {
  console.log(req.user);

  res.status(200).json({
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    gender: req.user.gender,
    phone: req.user.phone,
    email: req.user.email,
  });
});

exports.updateUser = TryAndCAtch(async (req, res, next) => {
  if (req.body.password || req.body.confirmpassword) {
    return next(
      new AppError("please use /upadatePassword to update the password", 400)
    );
  }
  req.body.updateAt = new Date()
  const updateUser = await users.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "sucess",
    data: updateUser,
    data: {
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      gender: updateUser.gender,
      phone: updateUser.phone,
      email: updateUser.email,
    },
  });
});
