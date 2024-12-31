"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Not Found Middleware: Handles requests for undefined API routes
const notFound = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: 'API Not Found!!',
        error: ' '
    });
};
exports.default = notFound;
