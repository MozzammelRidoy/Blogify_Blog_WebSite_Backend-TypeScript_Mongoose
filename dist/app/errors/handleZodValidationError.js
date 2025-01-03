"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Handles Zod validation errors and formats response
const handleZodValidationError = (err) => {
    const errorSources = err.issues.map((issue) => {
        return {
            path: issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1],
            message: issue === null || issue === void 0 ? void 0 : issue.message
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources
    };
};
exports.default = handleZodValidationError;
