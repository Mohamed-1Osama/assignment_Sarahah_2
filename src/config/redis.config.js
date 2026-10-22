
import { createClient } from "redis";
import { envConfig } from "./env.config.js";

const redisClient = createClient({
    url: envConfig.REDIS_CLOUD_URL,
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error.message);
});

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    console.log("Redis connected successfully");
};

export default redisClient;
