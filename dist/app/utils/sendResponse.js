"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Utility function to send standardized JSON responses in Express
const sendResponse = (res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.success,
        message: data.message,
        status: data === null || data === void 0 ? void 0 : data.statusCode,
        data: data.data
    });
};
exports.default = sendResponse;
