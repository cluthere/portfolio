import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../model/user.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

// generating jwt token
const generateAccessAndRefreshToken = async function (userId) {
  // finding user id from db
  const user = await User.findOne(userId);
  // assigning token
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  // saving refreshtoken in db
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// -----------------------> user register <---------------------------------

export const registerUser = asyncHandler(async (req, res) => {
  //checking data from input field is empty or not
  const { fullName, userName, email, password, phone } = req.body;

  // checking empty field
  if (
    [fullName, userName, email, password, phone].some(
      (input) => input?.trim() === ""
    )
  ) {
    throw new ApiError(409, "please fill all input field");
  }

  // checking username or email in db
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "username or email already exist.");
  }

  // saving data to db
  const user = await User.create({
    fullName,
    email,
    phone,
    userName,
    password,
  });

  // checking data is saved or not in db
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while regisering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user created successfully"));
});

// -------------> user login <------------------------------

export const userLogin = asyncHandler(async (req, res) => {
  //req data from body
  const { userName, email, password, phone } = req.body;

  // check if field is empty or not
  if ([userName, email, phone].some((input) => input?.trim() === "")) {
    throw new ApiError(409, "Username or email or phone number is required");
  }
  if ([password].some((input) => input?.trim() === "")) {
    throw new ApiError(409, "password is required");
  }

  // check username and email if it's match
  const user = await User.findOne({
    $or: [{ userName }, { email }, { phone }],
  });

  if (!user) {
    throw new ApiError(409, "username or email or phone doesn't exist.");
  }

  // check password is matching or not
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password Please try different password.");
  }

  // asign jwt access token and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // send cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user successfully logged-in"
      )
    );
});

// -------------> user logout <------------------------------

export const userLogout = asyncHandler(async (req, res) => {
  // updating refreshtoken
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // send response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// -------------> changePasswod <------------------------------

export const changePassword = asyncHandler(async (req, res) => {
  const { userName, password, resetPassword } = req.body;

  // checking empty field
  if ([password].some((input) => input?.trim() === "")) {
    throw new ApiError(409, "password is required");
  }

  // checking in db
  const user = await User.findOne({
    $or: [{ userName }],
  });

  // compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password Please try different password.");
  }
  // encryp changed password
  const changedPassword = await bcrypt.hash(resetPassword, 12);

  // updating password and reseting refresh token for logout
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        password: changedPassword,
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // send response
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User password changed successfully"));
});

// ---------------> delete user data <---------------------

export const deleteuser = asyncHandler(async (req, res) => {
  const { password, userName, email } = req.body;

  // checking empty field
  if ([password, userName, password].some((input) => input?.trim() === "")) {
    throw new ApiError(409, "password or username or email is required");
  }

  // checking in db
  const user = await User.findOne({
    $or: [{ password }, { userName }, { email }],
  });

  // checking username or email in db
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!existedUser) {
    throw new ApiError(409, "username or email doesn't exist.");
  }

  // compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password Please try different password.");
  }

  // updating password and reseting refresh token
  await User.deleteOne({ _id: user._id });

  const options = {
    httpOnly: true,
    secure: true,
  };

  // send response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User data deleted successfully"));
});
