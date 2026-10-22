import { Router } from "express";
import * as authService from "./auth.service.js";
import { signUpSchema } from "./auth.validation.js";
import { validate } from "../../Middlewares/validation.middleware.js";

const authController = Router();

// Register
authController.post(
    "/register",
    validate(signUpSchema),
    async (req, res, next) => {
        try {
            const { confirmPassword, ...userData } = req.body;

            const result = await authService.registerUser(userData);

            return res.status(201).json({
                message: "User registered successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
);

// Login
authController.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.SignIn({
            email,
            password
        });

        return res.status(200).json({
            message: "User logged in successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
});

export default authController;
