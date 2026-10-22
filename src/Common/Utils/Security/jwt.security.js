
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { envConfig } from "../../../config/env.config.js";
import { TOKEN_TYPES } from "../../constants.js";

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            jti: randomUUID(),
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            type: TOKEN_TYPES.ACCESS,
        },
        envConfig.ACCESS_TOKEN_SECRET,
        {
            expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
            algorithm: "HS256",
        }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            jti: randomUUID(),
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            type: TOKEN_TYPES.REFRESH,
        },
        envConfig.REFRESH_TOKEN_SECRET,
        {
            expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
            algorithm: "HS256",
        }
    );
};
