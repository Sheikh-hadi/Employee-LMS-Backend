import { User } from "../models/user.model.js"
import { AsyncHandler } from "../utilis/AsyncHandler.js"
import { ApiError } from "../utilis/ApiError.js"
import { ApiResponse } from "../utilis/ApiResponse.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const getUser = AsyncHandler(async (req, res, next) => {
    const user = await User.find().select('-password -refreshToken');
    // console.log("user", user)
    if (!user.length) {
        return res.status(404).json(new ApiError(404, "User does not exist"))
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User Fetch Data Sucessfully"))
})

const getUserById = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // console.log("id in getUserbyID: ", id);
    if (!id) {
        return res.status(400).json(new ApiError(400, "User id is required"))
    }
    let user = await User.find({ "id": id }).select("-password -refreshToken ")
    // console.log("user in getUserById: ", user)
    if (!user.length) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }
    user = user[0]
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User Fetch Data Sucessfully"))
})

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log("user", user)
        const accessToken = user.generateAccessToken()
        // console.log("accessToken", accessToken)
        const refreshToken = user.generateRefreshToken()
        // console.log("refreshToken", refreshToken)
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
// get user details from frontend
// validation - not empty
// check if user already exists: userName, email

// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// return res

const registerUser = AsyncHandler(async (req, res, next) => {
    const { fullName, userName, email, password, contactNumber, address } = req.body;
    // console.log("User Name:", userName); 
    // console.log("req.body", req.body);

    // Validate required fields
    if ([fullName, userName, email, password, contactNumber, address].some(field => !field || field.trim() === "")) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { userName }] });
    // console.log("userExists", userExists);

    if (userExists) {
        if (userExists.email === email) {
            return res.status(400).json(new ApiError(400, "Email already exists"));
        }
        if (userExists.userName === userName) {
            return res.status(400).json(new ApiError(400, "Username already exists"));
        }
    }


    const userCount = await User.countDocuments();
    const id = userCount + 1;


    const data = {
        id,
        fullName,
        userName,
        password,
        email,
        contactNumber,
        address,
    };

    console.log("data", data);


    const user = await User.create({
        id,
        fullName,
        userName,
        password,
        email,
        contactNumber,
        address,
    });


    const createdUser = await User.findById(user._id).select("-password -refreshToken -_id");
    // console.log("createdUser", createdUser);

    if (!createdUser) {
        return res.status(400).json(new ApiError(400, "User not created"));
    }

    return res.status(200).json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = AsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // console.log("req.body", req.body);

    // Check for empty fields
    if ([email, password].some((field) => field?.trim() === "")) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    // Find user by email 
    const user = await User.findOne({ email });
    // console.log("user in login", user);
    if (!user) {
        return res.status(404).json(new ApiError(404, "User does not exist"));
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log("isPasswordValid", isPasswordValid);
    if (!isPasswordValid) {
        return res.status(400).json(new ApiError(400, "Invalid password"));
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Fetch user again if necessary (though you already have the `user` object)
    const loggedInUser = await User.findById(user._id).select('-_id -email -password');
    // console.log("loggedInUser", loggedInUser);
    if (!loggedInUser) {
        return res.status(404).json(new ApiError(404, "User does not exist"));
    }

    // Set secure cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
    };

    // Send success response
    res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"));
});

const deleteUser = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log("id: ", id);
    if (!id) {
        return res.status(400).json(new ApiError(400, "User id is required"))
    }
    let user = await User.find({ "id": id })
    console.log("user: ", user)
    if (!user.length) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }
    user = user[0]
    const deleteUser = await User.findByIdAndDelete(user._id).select('-_id, -password, -refreshToken, ');
    console.log(deleteUser)

    return res
        .status(200)
        .json(new ApiResponse(200, deleteUser, "User deleted successfully"))
});

const logoutUser = AsyncHandler(async (req, res, next) => {
    // console.log("req.user", req.user)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = AsyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json(ApiError(401, "unauthorized request"))
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            return res.status(401).json(ApiError(401, "Invalid refresh token"))
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json(ApiError(401, "Refresh token is expired or used"))

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        return res.status(401).json(ApiError(401, "Invalid refresh token"))
    }

})

const updateUser = AsyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { fullName, userName, email, contactNumber, address, status } = req.body;
    console.log("req.body: ", req.body);

    // Convert all fields to strings and trim them
    const fields = [fullName, userName, email, contactNumber, address].map(field => String(field).trim());

    if (fields.some(field => !field)) {
        return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const user = await User.findOne({ "id": id });
    console.log("user: ", user);
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            fullName: fields[0],
            userName: fields[1],
            email: fields[2],
            contactNumber: fields[3],
            address: fields[4],
            status: fields[5]
        },
        {
            new: true
        }
    ).select('-_id -password -refreshToken');

    return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
});


const checkMail = AsyncHandler(async (req, res, next) => {
    const { email } = req.body;
    console.log("email: ", email)
    if (!email) {
        return res.status(400).json(new ApiError(400, "Email is required"));
    }
    const user = await User.findOne({ email }).select('-_id, -password, -refreshToken, ');
    console.log("user: ", user)
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }
    return res
        .status(200)
        .json(new ApiResponse(201, user, "User found"));
})

const changeCurrentPassword = AsyncHandler(async (req, res) => {
    const { email, newPassword } = req.body
    console.log("email: ", email);
    console.log("newPassword: ", newPassword);

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not Exist"))
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

export { getUser, registerUser, deleteUser, loginUser, logoutUser, refreshAccessToken, getUserById, updateUser, checkMail, changeCurrentPassword }