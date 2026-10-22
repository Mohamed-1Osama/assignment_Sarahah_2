import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { decodeRefreshToken } from "../../Middlewares/decode-refresh-token.middleware.js";
import { logoutUser } from "./logout.service.js";

const logoutController = Router();

logoutController.post(
    "/logout",
    authentication,
    decodeRefreshToken,
    async (req, res, next) => {
        try {
            const result = await logoutUser(
                req.accessTokenPayload,
                req.refreshTokenPayload
            );

            return res.status(200).json({
                message: result.message,
            });
        } catch (error) {
            return next(error);
        }
    }
);

export default logoutController;
