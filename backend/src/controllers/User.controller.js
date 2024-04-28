import User from "../models/User.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiResponce from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body);
  //  validation
  if (!email) {
    return res.status(400).json({
      error: "email is required",
    });
  }

  if (!password) {
    console.log(password);
    return res.status(400).json({
      error: "password is required",
    });
  }
  if (
    [name, email, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  //  check if user already exist: username, email
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    console.log(existedUser);
    return res.status(400).json({
      error: "User already exist",
    });
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    return res.status(400).json({
      error: "Error while creating User",
    });
  }
  console.log(user);

  return res
    .status(201)
    .json(new ApiResponce(201, "User created successfully", user, true, false));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      error: "password is required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      error: "user not exist",
    });
  }


  const isPassValid = await user.isPasswordCorrect(password);

  if (!isPassValid) {
    return res.status(400).json({
      error: "Invalid Password Check your password and try again",
    });
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(200, "User Logged in Sucessfully", {
        user,
        accessToken,
        refreshToken,
      })
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ;
  console.log(incomingRefreshToken);
  if (!incomingRefreshToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // Retrieve the user based on the decoded token
    const user = await User.findById(decodedToken?._id);
    console.log(user);
    if (!user) {
        return res.status(400).json({
            error: "Invalid Refresh Token",
          });
      
    }

    // Check if the refresh token matches the stored refresh token for the user
    if (user.refreshToken != incomingRefreshToken) {
      console.log("different refresh token");
      return res.status(400).json({
        error: "Refresh Token is used or Expire",
      });
    }
    console.log("same refresh token");
    const options = {
      httpOnly: true,
      secure: true,
    };
    // Generate new access and refresh tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
  
    user.refreshToken = refreshToken;
    await user.save();
    console.log("new access token" + accessToken);  
    console.log("new refresh token" + refreshToken);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponce(200, "Access Token Refreshed", {
          accessToken,
          refreshToken,
        })
      );
  } catch (err) {
    return res.status(400).json({
        error: "Error occured while generating access token",
      });
  }
});

const profileUser = asyncHandler(async (req, res) => {
 const {accessToken, refreshToken} = req.cookies;
//  console.log(accessToken, refreshToken);
 if(!refreshToken){
    return res.status(401).json({
        error: "Login Again",
      });
 }
 if(!accessToken){
    return res.status(400).json({
        error: "Generate Access Token Again",
      });
 }

 const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
 const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
//  console.log(user);
 return res.status(200).json({
    user,
 })
});



const logoutUser = asyncHandler(async (req, res) => {
  const {accessToken, refreshToken} = req.cookies;

if (!refreshToken) {
  return res.status(401).json({ error: "User is already logged out" });
}


  // Verify the refresh token
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  // Retrieve the user based on the decoded token
  const user = await User.findById(decodedToken?._id);
  console.log(user);
  if (!user) {
      return res.status(400).json({
          error: "Invalid Refresh Token",
        });
    
  }

  // Check if the refresh token matches the stored refresh token for the user
  if (user.refreshToken != refreshToken) {
    console.log("different refresh token");
    return res.status(400).json({
      error: "Refresh Token is used or Expire",
    });
  }
  console.log("same refresh token");
 
  user.refreshToken = null;
  await user.save();
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, "User logout Sucessfully"));
});



export { registerUser, loginUser, refreshAccessToken,profileUser ,logoutUser};
