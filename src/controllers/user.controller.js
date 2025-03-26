import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../modles/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespons.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() == "") //it return true when field is empty
  ) {
    throw new ApiError(400, "all fields are require");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "user with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);
  if (avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  const user = await User.create({
    fullName,
    avatar,
    coverImage: coverImage || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await user
    .findById(user._id)
    .select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "somthing went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export { registerUser };
