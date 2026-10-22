
/**
 * find - list
 * findOne - one document
 * findById - one document by id
 */

import User from "../../DB/Models/user.model.js";
import HttpAppError from "../../Common/Utils/Errors/app.error.js";
import { ERROR_CODES } from "../../Common/constants.js";
import { encrypt } from "../../Common/Utils/Security/encryption.security.js";
import { hash, verifyPassword } from "../../Common/Utils/Security/hash.security.js";
import { generateAccessToken, generateRefreshToken } from "../../Common/Utils/Security/jwt.security.js";

export const registerUser = async (body) => {
    const {
        firstName,
        lastName,
        email,
        password,
        gender,
        age,
        phoneNumber
    } = body;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const isExistingUser = await User.findOne({ email: normalizedEmail });

    if (isExistingUser) {
        throw new HttpAppError(
            "User already exists",
            409,
            { duplicatedEmail: normalizedEmail },
            ERROR_CODES.EMAIL_CONFLICT
        );
    }

    // Encrypt phone number
     const encryptedPhone = phoneNumber
        ? encrypt(phoneNumber)
        : undefined;

    // Hash password
    const hashedPassword = await hash(password);

    // Never accept the role from the request body.
    // The model assigns the default role: "user".
    const user = await User.create({
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        gender,
        age,
        phoneNumber: encryptedPhone 
    });

    const userData = user.toObject();
    delete userData.password;

    return userData;
};

export const SignIn = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Password is excluded by default in the model,
    // so explicitly include it for password verification.
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
        throw new HttpAppError(
            "Invalid email or password",
            401,
            {},
            ERROR_CODES.INVALID_CREDENTIALS
        );
    }

    // Compare entered password with stored hash
    const isPasswordCorrect = await verifyPassword(
        user.password,
        password
    );

    if (!isPasswordCorrect) {
        throw new HttpAppError(
            "Invalid email or password",
            401,
            {},
            ERROR_CODES.INVALID_CREDENTIALS
        );
    }

    // Generate Access Token and Refresh Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Exclude password from returned user data
    const userData = user.toObject();
    delete userData.password;

    return {
        user: userData,
        accessToken,
        refreshToken
    };
};
