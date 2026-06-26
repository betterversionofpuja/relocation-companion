import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User does not exist");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        if (error instanceof ApiError) throw error;

        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh tokens"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if (!fullName?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existedUser = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail }
        ]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User with username or email already exists"
        );
    }

    const user = await User.create({
        fullName: fullName.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        password
    });

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(username || email) || !password) {
        throw new ApiError(
            400,
            "username/email and password are required"
        );
    }

    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();

    const user = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail }
        ]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid =
        await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid user credentials"
        );
    }

    const {
        accessToken,
        refreshToken
    } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    return res
        .status(200)
        .cookie(
            "accessToken",
            accessToken,
            cookieOptions
        )
        .cookie(
            "refreshToken",
            refreshToken,
            cookieOptions
        )
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );

    return res
        .status(200)
        .clearCookie(
            "accessToken",
            cookieOptions
        )
        .clearCookie(
            "refreshToken",
            cookieOptions
        )
        .json(
            new ApiResponse(
                200,
                null,
                "User logged out successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(
            401,
            "Unauthorized request"
        );
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(
            decodedToken?._id
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        if (
            incomingRefreshToken !==
            user.refreshToken
        ) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        const {
            accessToken,
            refreshToken: newRefreshToken
        } = await generateAccessAndRefreshTokens(
            user._id
        );

        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                cookieOptions
            )
            .cookie(
                "refreshToken",
                newRefreshToken,
                cookieOptions
            )
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid refresh token"
        );
    }
});

const changeCurrentPassword = asyncHandler(
    async (req, res) => {
        const {
            oldPassword,
            newPassword
        } = req.body;

        if (!oldPassword || !newPassword) {
            throw new ApiError(
                400,
                "Old password and new password are required"
            );
        }

        const user = await User.findById(
            req.user._id
        );

        const isPasswordCorrect =
            await user.isPasswordCorrect(
                oldPassword
            );

        if (!isPasswordCorrect) {
            throw new ApiError(
                400,
                "Invalid old password"
            );
        }

        user.password = newPassword;

        await user.save({
            validateBeforeSave: false
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "Password changed successfully"
                )
            );
    }
);

const getCurrentUser = asyncHandler(
    async (req, res) => {
        return res.status(200).json(
            new ApiResponse(
                200,
                req.user,
                "User fetched successfully"
            )
        );
    }
);

const updateAccountDetails = asyncHandler(
    async (req, res) => {
        const { fullName, email, username } = req.body;

        if (!fullName || !email || !username) {
            throw new ApiError(
                400,
                "fullName, username and email are required"
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();

        const existedUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ],
            _id: { $ne: req.user._id }
        });

        if (existedUser) {
            throw new ApiError(
                409,
                "email or username already belongs to another account"
            );
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName: fullName.trim(),
                    email: normalizedEmail,
                    username: normalizedUsername
                }
            },
            {
                returnDocument: "after"
            }
        ).select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(
                200,
                user,
                "Profile updated successfully"
            )
        );
    }
);

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
};