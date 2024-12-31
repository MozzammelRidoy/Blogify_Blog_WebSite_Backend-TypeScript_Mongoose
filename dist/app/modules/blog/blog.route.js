"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const blog_validationZodSchema_1 = require("./blog.validationZodSchema");
const blog_controller_1 = require("./blog.controller");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
// Route to fetch all blogs
router.get('/', blog_controller_1.BlogControllers.getAllBlogs);
// Route to create a new blog
router.post('/', (0, auth_1.auth)('user'), (0, validateRequest_1.default)(blog_validationZodSchema_1.BlogValidation.createBlogValidationZodSchema), blog_controller_1.BlogControllers.createBlog);
// Route to update an existing blog
router.patch('/:id', (0, auth_1.auth)('user'), (0, validateRequest_1.default)(blog_validationZodSchema_1.BlogValidation.updateBlogValidationZodSchema), blog_controller_1.BlogControllers.updateBlog);
// Route to delete a blog
router.delete('/:id', (0, auth_1.auth)('user'), blog_controller_1.BlogControllers.deleteBlog);
exports.BlogRoutes = router;
