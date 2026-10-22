class HttpAppError extends Error {
    constructor(
        message,
        statusCode = 400,
        data = {},
        code = "BAD_REQUEST"
    ) {
        super(message);

        this.name = "HttpAppError";
        this.statusCode = statusCode;
        this.data = data;
        this.code = code;

        Error.captureStackTrace?.(this, HttpAppError);
    }
}

export default HttpAppError;
