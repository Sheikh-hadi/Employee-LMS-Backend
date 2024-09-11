import { User } from "../models/user.model.js"
import { AsyncHandler } from "../utilis/AsyncHandler.js"
import { ApiError } from "../utilis/ApiError.js"
import { ApiResponse } from "../utilis/ApiResponse.js"


const getUser = AsyncHandler(async (req, res, next) => {
    const user = await User.find().select("-password -refreshToken ");
    if (!user.length) {
        return res.status(404).json(new ApiError(404, "User does not exist"))
    }
    return res
        .status(200)
        .json(ApiResponse(200, user, "User Fetch Data Sucessfully"))
})

// get user details from frontend
// validation - not empty
// check if user already exists: username, email

// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// return res

const createUser = AsyncHandler(async (req, res, next) => {
    const { fullName, username, email, password, avatar } = req.body;
    if ([fullName, username, email, password, avatar].some((field) => field?.trim() === "")) {
        return res.status(400).json(new ApiError(400, "All fields are required"))
    }
    const userExists = await User.findOne({ $or: [{ username }, { email }] })
    if (userExists) {
        return res.status(400).json(new ApiError(400, "User already exists"))
    }
    const user = 
})


    export { getUser }