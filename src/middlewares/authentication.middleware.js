import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";
import { TOKEN_TYPES, ERROR_CODES } from "../Common/constants.js";
import HttpAppError from "../Common/Utils/Errors/app.error.js";
import redisClient from "../Common/Clients/redis.client.js";

export const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader) {
            throw new HttpAppError(
                "Access token required",
                401,
                {},
                ERROR_CODES.UNAUTHORIZED
            );
        }

        // Extract Bearer prefix and token
        const [prefix, token, ...extraParts] = authHeader.split(" ");

        if (
            prefix !== "Bearer" ||
            !token ||
            extraParts.length > 0
        ) {
            throw new HttpAppError(
                "Invalid authorization format. Use Bearer <access_token>",
                400,
                {},
                ERROR_CODES.INVALID_TOKEN
            );
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            envConfig.ACCESS_TOKEN_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        // Check token type
        if (decoded.type !== TOKEN_TYPES.ACCESS) {
            throw new HttpAppError(
                "Access token required. This token type is not allowed",
                401,
                {},
                ERROR_CODES.INVALID_TOKEN
            );
        }

        // Validate token payload
        if (!decoded.id || !decoded.role || !decoded.jti || !decoded.exp) {
            throw new HttpAppError(
                "Invalid access token payload",
                401,
                {},
                ERROR_CODES.INVALID_TOKEN
            );
        }

        // Check if token has been revoked (logged out)
        const isRevoked = await redisClient.exists(
            `revoked:access:${decoded.jti}`
        );

        if (isRevoked) {
            throw new HttpAppError(
                "Access token has been revoked",
                401,
                {},
                ERROR_CODES.INVALID_TOKEN
            );
        }

        // Save token payload
        req.accessTokenPayload = decoded;

        // Map token payload to req.user
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

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
                    "Invalid or expired access token",
                    401,
                    {},
                    ERROR_CODES.INVALID_TOKEN
                )
            );
        }

        return next(error);
    }
};
