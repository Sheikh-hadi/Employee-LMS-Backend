import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { ApiError } from "../utilis/ApiError.js";
import { AsyncHandler } from "../utilis/AsyncHandler.js";

export const isAuthenticated = AsyncHandler(async (req, res, next) => {
    // console.log("req.cookies", req.cookies)
    // console.log("req.body", req.body)
    const accessToken = req.cookies.accessToken;
    // console.log("accessToken", accessToken)
    if (!accessToken) {
        return res.status(401).json(new ApiError(401, "unauthorized request"))
    }
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        // console.log("decodedToken", decodedToken)
        const user = await User.findById(decodedToken._id)
        console.log("user", user)
        if (!user) {
            return res.status(401).json(new ApiError(401, "unauthorized request"))
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json(new ApiError(401, "unauthorized request"))
    }
})