
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";
import { TOKEN_TYPES, ERROR_CODES } from "../Common/constants.js";
import HttpAppError from "../Common/Utils/Errors/app.error.js";
import redisClient from "../Common/Clients/redis.client.js";

export const decodeRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body ?? {};

        // Check if refresh token exists
        if (
            typeof refreshToken !== "string" ||
            !refreshToken.trim()
        ) {
            throw new HttpAppError(
                "Refresh token is required",
                401,
                {},
                ERROR_CODES.UNAUTHORIZED
            );
        }

        // Verify JWT
        const decoded = jwt.verify(
            refreshToken,
            envConfig.REFRESH_TOKEN_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        // Validate token payload
        if (
            decoded.type !== TOKEN_TYPES.REFRESH ||
            !decoded.id ||
            !decoded.jti ||
            !decoded.exp
        ) {
            throw new HttpAppError(
                "Invalid refresh token payload",
                401,
                {},
                ERROR_CODES.INVALID_TOKEN
            );
        }

        // Check if refresh token has been revoked
        const isRevoked = await redisClient.exists(
            `revoked:refresh:${decoded.jti}`
        );

        if (isRevoked) {
            throw new HttpAppError(
                "Refresh token has been revoked",
                401,
                {},
                ERROR_CODES.INVALID_TOKEN
            );
        }

        // Save token and payload for the next middleware/controller
        req.refreshToken = refreshToken;
        req.refreshTokenPayload = decoded;

        return next();

    } catch (error) {
        if (error instanceof HttpAppError) {
            return next(error);
        }

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return next(
                new HttpAppError(
                    "Invalid or expired refresh token",
                    401,
                    {},
                    ERROR_CODES.INVALID_TOKEN
                )
            );
        }

        return next(error);
    }
};
