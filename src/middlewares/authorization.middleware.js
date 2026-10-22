
import HttpAppError from "../Common/Utils/Errors/app.error.js";
import { USER_ROLES } from "../Common/constants.js";

export const authorization = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                throw new HttpAppError(
                    "Authentication required",
                    401,
                    {},
                    "UNAUTHORIZED"
                );
            }

            // Validate allowed roles configuration
            if (
                !Array.isArray(allowedRoles) ||
                allowedRoles.length === 0
            ) {
                throw new HttpAppError(
                    "No roles configured for this resource",
                    500,
                    {},
                    "INTERNAL_SERVER_ERROR"
                );
            }

            // Check if user's role is allowed
            if (!allowedRoles.includes(req.user.role)) {
                throw new HttpAppError(
                    "You are not allowed to access this resource",
                    403,
                    {},
                    "FORBIDDEN"
                );
            }

            next();
        } catch (error) {
            return next(error);
        }
    };
};
