import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../model/user.model.js";
import Jwt  from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try{
    const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = Jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "invalid access token");
  }

  req.user = user;
  next()
  } catch(error){
    throw new ApiError(401, error?.message, "invalid access token");
  }
  
});

