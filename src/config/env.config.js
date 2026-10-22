
import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (name) => {
    const value = process.env[name];

    if (!value || !value.trim()) {
        throw new Error(
            `Missing required environment variable: ${name}`
        );
    }

    return value;
};

export const envConfig = Object.freeze({
    PORT: Number(process.env.PORT) || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    DB_URI_LOCAL: requiredEnv("DB_URI_LOCAL"),

    ACCESS_TOKEN_SECRET: requiredEnv("ACCESS_TOKEN_SECRET"),

    ACCESS_TOKEN_EXPIRATION:
        process.env.ACCESS_TOKEN_EXPIRATION || "15m",

    REFRESH_TOKEN_SECRET: requiredEnv("REFRESH_TOKEN_SECRET"),

    REFRESH_TOKEN_EXPIRATION:
        process.env.REFRESH_TOKEN_EXPIRATION || "7d",

    REDIS_CLOUD_URL: requiredEnv("REDIS_CLOUD_URL"),
});
