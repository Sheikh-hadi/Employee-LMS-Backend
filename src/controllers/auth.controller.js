import { AsyncHandler } from "../utilis/AsyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponse.js";


const auth = AsyncHandler(async (req, res, next) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User is authenticated"))
})

export { auth }

  