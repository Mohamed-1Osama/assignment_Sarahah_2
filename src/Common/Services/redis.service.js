
import redisClient from "../Clients/redis.client.js";

// String methods
export const set = async (key, value, expirationInSeconds) => {
    if (expirationInSeconds) {
        return redisClient.set(key, value, {
            EX: expirationInSeconds,
        });
    }

    return redisClient.set(key, value);
};

export const get = async (key) => {
    return redisClient.get(key);
};

export const del = async (key) => {
    return redisClient.del(key);
};

export const exists = async (key) => {
    return redisClient.exists(key);
};

export const expire = async (key, seconds) => {
    return redisClient.expire(key, seconds);
};

// JSON methods
export const setJSON = async (key, value, expirationInSeconds) => {
    const serializedValue = JSON.stringify(value);

    return set(key, serializedValue, expirationInSeconds);
};

export const getJSON = async (key) => {
    const value = await get(key);

    return value === null ? null : JSON.parse(value);
};

// Hash methods
export const hSet = async (key, field, value) => {
    return redisClient.hSet(key, field, value);
};

export const hGetAll = async (key) => {
    return redisClient.hGetAll(key);
};

// Set methods
export const sAdd = async (key, value) => {
    return redisClient.sAdd(key, value);
};

export const sMembers = async (key) => {
    return redisClient.sMembers(key);
};

// List methods
export const lPush = async (key, value) => {
    return redisClient.lPush(key, value);
};

export const lRange = async (key, start, stop) => {
    return redisClient.lRange(key, start, stop);
};
