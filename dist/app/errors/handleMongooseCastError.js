"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Handles Mongoose CastError and formats response
const handleMongooseCastError = (err) => {
    const errorSources = [
        {
            path: err === null || err === void 0 ? void 0 : err.path,
            message: err === null || err === void 0 ? void 0 : err.message
        }
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID',
        errorSources
    };
};
exports.default = handleMongooseCastError;
