
export const USER_ROLES = Object.freeze({
    USER: "user",
    ADMIN: "admin",
});

export const USER_GENDERS = Object.freeze({
    MALE: "male",
    FEMALE: "female",
});

export const TOKEN_TYPES = Object.freeze({
    ACCESS: "access",
    REFRESH: "refresh",
});

export const ERROR_CODES = Object.freeze({
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    INVALID_TOKEN: "INVALID_TOKEN",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    EMAIL_CONFLICT: "EMAIL_CONFLICT",
    BAD_REQUEST: "BAD_REQUEST",
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
});
