"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
// Validation schema for creating a new blog
const createBlogValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Titile is required'
        })
            .max(200, { message: 'Title must be 200 or fewer characters long' }),
        content: zod_1.z.string({
            required_error: 'Content is required'
        })
    })
});
// Validation schema for updating an existing blog
const updateBlogValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Titile is required'
        })
            .max(200, { message: 'Title must be 200 or fewer characters long' })
            .optional(),
        content: zod_1.z
            .string({
            required_error: 'Content is required'
        })
            .optional()
    })
});
// Exporting the validation schemas to be used in controllers
exports.BlogValidation = {
    createBlogValidationZodSchema,
    updateBlogValidationZodSchema
};
