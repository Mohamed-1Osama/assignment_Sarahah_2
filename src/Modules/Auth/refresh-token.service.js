
import jwt from "jsonwebtoken";
import User from "../../DB/Models/user.model.js";
import { envConfig } from "../../config/env.config.js";
import { TOKEN_TYPES, ERROR_CODES } from "../../Common/constants.js";
import HttpAppError from "../../Common/Utils/Errors/app.error.js";
import { generateAccessToken } from "../../Common/Utils/Security/jwt.security.js";

export const refreshAccessToken = async (refreshToken) => {
    if (
        typeof refreshToken !== "string" ||
        !refreshToken.trim()
    ) {
        throw new HttpAppError(
            "Refresh token is required",
            400,
            {},
            ERROR_CODES.BAD_REQUEST
        );
    }

    let decoded;

    try {
        decoded = jwt.verify(
            refreshToken,
            envConfig.REFRESH_TOKEN_SECRET,
            {
                algorithms: ["HS256"],
            }
        );
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            throw new HttpAppError(
                "Invalid or expired refresh token",
                401,
                {},
                ERROR_CODES.INVALID_TOKEN
            );
        }

        throw error;
    }

    if (
        decoded.type !== TOKEN_TYPES.REFRESH ||
        !decoded.id
    ) {
        throw new HttpAppError(
            "A valid refresh token is required",
            401,
            {},
            ERROR_CODES.INVALID_TOKEN
        );
    }

    // Confirm that the user still exists and use the current role.
    const user = await User.findById(decoded.id);

    if (!user) {
        throw new HttpAppError(
            "User no longer exists",
            401,
            {},
            ERROR_CODES.INVALID_TOKEN
        );
    }

    const accessToken = generateAccessToken(user);

    return { accessToken };
};
