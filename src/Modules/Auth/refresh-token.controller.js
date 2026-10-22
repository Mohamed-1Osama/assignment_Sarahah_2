import { Router } from "express";
import { decodeRefreshToken } from "../../Middlewares/decode-refresh-token.middleware.js";
import { refreshAccessToken } from "./refresh-token.service.js";

const refreshTokenController = Router();

refreshTokenController.post(
    "/refresh",
    decodeRefreshToken,
    async (req, res, next) => {
        try {
            const result = await refreshAccessToken(
                req.refreshToken
            );

            return res.status(200).json({
                message: "Access token refreshed successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }
);

export default refreshTokenController;
