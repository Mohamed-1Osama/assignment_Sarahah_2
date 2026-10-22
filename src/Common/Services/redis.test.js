
import * as redisService from "./redis.service.js";
import redisClient, {
    connectRedis,
} from "../Clients/redis.client.js";

const testRedis = async () => {
    try {
        await connectRedis();

        const pingResponse = await redisClient.ping();
        console.log("Redis PING:", pingResponse);

        await redisService.set("name", "Mohamed");

        const name = await redisService.get("name");
        console.log("Name:", name);

        await redisService.setJSON(
            "user:123",
            { name: "Mohamed", age: 23 },
            60
        );

        const user = await redisService.getJSON("user:123");
        console.log("User:", user);

        await redisService.del("name");
        console.log("Name key deleted");
    } catch (error) {
        console.error("Redis test failed:", error.message);
    } finally {
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    }
};

testRedis();
