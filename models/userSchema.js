const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { assert } = require("console");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "plese enter your firstName"],
  },
  lastName: {
    type: String,
    required: [true, "please enter your lastName"],
  },
  dob: {
    type: String,
    required: [true, "please enter your dob"],
  },
  gender: {
    type: String,
    required: [true, "please enter your gender"],
  },
  phone: {
    type: Number,
    required: [true, "please enter your phone number"],
    min: 1000000000,
    max: 9999999999,
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    validate: {
      validator: function (pwd) {
        const regex = /^(?=.*[0-9])(?=.*[!@#$%&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        return regex.test(pwd);
      },
      message:
        "posword must be contain  uppercase, lowecase,special character and then  Number.",
    },
  },
  confirmpassword: {
    type: String,
    required: [true, "please enter your confirmpassword"],
    validate: {
      validator: function (cfmpwd) {
        return cfmpwd === this.password;
      },
      message: "posword and confirmpassword does not match",
    },
  },
  creationAt: Date,
  updateAt: Date,
  passwordchanedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresIn: Date,
});
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmpassword = undefined;
  next();
});
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
)  {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.passwordChanged = (JWTtimestamp) => {
  if (this.passwordchanedAt) {
    const changedTimestamp = parseInt(
      this.passwordchanedAt.getTime() / 1000,
      10
    );
    return JWTtimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createpasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
  
};

const users = mongoose.model("users", userSchema);

module.exports = users;





