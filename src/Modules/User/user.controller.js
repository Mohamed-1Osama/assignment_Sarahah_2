
import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { authorization } from "../../Middlewares/authorization.middleware.js";
import HttpAppError from "../../Common/Utils/Errors/app.error.js";
import { USER_ROLES } from "../../Common/constants.js";

const userController = Router();

// Public health check
userController.get("/health", (req, res) => {
    return res.status(200).json({
        message: "User service is healthy",
    });
});

// Get profile: Admin can access any profile; User can access their own
userController.get(
    "/profile/:userId",
    authentication,
    authorization([USER_ROLES.ADMIN, USER_ROLES.USER]),
    async (req, res, next) => {
        try {
            const { userId } = req.params;

            if (
                req.user.role !== USER_ROLES.ADMIN &&
                req.user.id !== userId
            ) {
                throw new HttpAppError(
                    "You can only access your own profile",
                    403,
                    {},
                    "FORBIDDEN"
                );
            }

            const result = await userService.getUserProfileById(userId);

            return res.status(200).json({
                message: "User profile retrieved successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }
);

// List all users: Admin only
userController.get(
    "/",
    authentication,
    authorization([USER_ROLES.ADMIN]),
    async (req, res, next) => {
        try {
            const result = await userService.getAllUsers();

            return res.status(200).json({
                message: "Users retrieved successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }
);

// Update profile: Admin can update anyone; User can update their own
userController.patch(
    "/update/:userId",
    authentication,
    authorization([USER_ROLES.ADMIN, USER_ROLES.USER]),
    async (req, res, next) => {
        try {
            const { userId } = req.params;

            if (
                req.user.role !== USER_ROLES.ADMIN &&
                req.user.id !== userId
            ) {
                throw new HttpAppError(
                    "You can only update your own profile",
                    403,
                    {},
                    "FORBIDDEN"
                );
            }

            // Only allow these fields to be updated
            const { firstName, lastName, email, gender, age } = req.body;

            const result = await userService.updateProfile(
                { firstName, lastName, email, gender, age },
                userId
            );

            return res.status(200).json({
                message: "User updated successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }
);

// Delete profile: Admin only
userController.delete(
    "/delete/:userId",
    authentication,
    authorization([USER_ROLES.ADMIN]),
    async (req, res, next) => {
        try {
            const result = await userService.deleteProfile(
                req.params.userId
            );

            return res.status(200).json({
                message: "User deleted successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }
);

export default userController;
