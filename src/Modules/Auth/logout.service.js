import redisClient from "../../Common/Clients/redis.client.js";

export const logoutUser = async (accessTokenPayload, refreshTokenPayload) => {
    const now = Math.floor(Date.now() / 1000);

    const tokens = [
        {
            payload: accessTokenPayload,
            keyPrefix: "revoked:access:",
        },
        {
            payload: refreshTokenPayload,
            keyPrefix: "revoked:refresh:",
        },
    ];

    for (const { payload, keyPrefix } of tokens) {
        const remainingTime = payload.exp - now;

        if (remainingTime > 0) {
            await redisClient.set(
                `${keyPrefix}${payload.jti}`,
                "revoked",
                { EX: remainingTime }
            );
        }
    }

    return { message: "Logged out successfully" };
};
