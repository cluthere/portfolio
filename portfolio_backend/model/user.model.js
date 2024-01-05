import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please type your name"],
    },
    userName: {
      type: String,
      required: [true, "Please type your Username"],
      unique: true,
      minlength: [3, "username should greater than 3 alphabet"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please type valid Email"],
    },
    phone: {
      type: String,
      required: [true, "please enter your phone number"],
      unique: true,
      minlength: [10, "please type correct phone number"],
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
    },
    refreshToken:{
      type:String,
    }
  },
  { timeStamps: true }
);

// password encryption
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")){return next()}
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


// compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//jwt token
// access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      userName: this.userName,
      phone: this.phone,
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
  );
};


// refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY}
  );
};

const User = mongoose.model("User", userSchema);

export default User;
