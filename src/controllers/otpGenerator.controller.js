import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { Otp } from "../models/otp.model.js";
import { AsyncHandler } from "../utilis/AsyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { User } from "../models/user.model.js";

const sendMailOtp = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 587, 
        secure: false, 
        auth: {
            user:"abdulwahabgps@gmail.com", 
            pass: "gzit cxsw jeky akrq", 
        },
    });

  
    let mailOptions = {
        from: '"Your App Name" <sheikhgee322@gmail.com>', 
        to: email, 
        subject: "Your OTP Code", 
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`, 
    };

   
    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP ${otp} sent to ${email}`);
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
};



const generateOtp = AsyncHandler(async (req, res, next) => {
    console.log("req.body", req.body);
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(new ApiError(400, "Email is required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }

    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
        return res.status(400).json(new ApiError(400, "OTP already generated, please wait before requesting a new one."));
    }

    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false
    });

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 1);

    const newOtp = await Otp.create({
        otp,
        email,
        expiresAt: expirationTime
    });

    sendMailOtp(email, otp);
    return res.status(200).json(new ApiResponse(200, newOtp, "OTP generated and sent successfully"));
});

const checkOpt = AsyncHandler(async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).json(new ApiError(400, "OTP and email are required"));
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
        return res.status(400).json(new ApiError(400, "No OTP found for this email or it has expired"));
    }

    if (otpRecord.otp !== otp) {
        return res.status(400).json(new ApiError(400, "Invalid OTP"));
    }

    await Otp.deleteOne({ email });

    return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

export { generateOtp, checkOpt };