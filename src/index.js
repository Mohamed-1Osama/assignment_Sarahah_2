
import "dotenv/config";
import express from "express";

import authController from "./Modules/Auth/auth.controller.js";
import refreshTokenController from "./Modules/Auth/refresh-token.controller.js";
import logoutController from "./Modules/Auth/logout.controller.js";

import userController from "./Modules/User/user.controller.js";
import messageController from "./Modules/Message/message.controller.js";

import dbConnection from "./DB/db.connection.js";
import { connectRedis } from "./Common/Clients/redis.client.js";

const app = express();

// Global middleware
app.use(express.json());

// Routers
app.use("/api/auth", authController);
app.use("/api/auth", refreshTokenController);
app.use("/api/auth", logoutController);

app.use("/api/users", userController);
app.use("/api/message", messageController);

// Sample API
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Blog App API is running",
    });
});

// Not found middleware
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        message: err.statusCode
            ? err.message
            : "Internal Server Error",
        code: err.code || "INTERNAL_SERVER_ERROR",
    });
});

const port = process.env.PORT || 3000;

// Connect to services before starting the server
const startServer = async () => {
    try {
        await dbConnection();
        await connectRedis();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
