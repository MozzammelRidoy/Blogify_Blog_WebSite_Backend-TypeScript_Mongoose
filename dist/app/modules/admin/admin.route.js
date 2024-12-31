"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
// =================== User Related API Routes ===================
// Route to get all users (requires admin authentication)
router.get('/users', (0, auth_1.auth)('admin'), admin_controller_1.AdminControllers.getAllUsers);
// Route to get a single user by ID (requires admin authentication)
router.get('/users/:userId', (0, auth_1.auth)('admin'), admin_controller_1.AdminControllers.getSingleUser);
// Route to block a user (requires admin authentication)
router.patch('/users/:userId/block', (0, auth_1.auth)('admin'), admin_controller_1.AdminControllers.userBlocked);
// Route to delete a user (requires admin authentication)
router.patch('/users/:userId/delete', (0, auth_1.auth)('admin'), admin_controller_1.AdminControllers.userDeleted);
// =================== Blog Related API Routes ===================
// Route to get a single blog post by ID (requires admin authentication)
router.get('/blogs/:id', (0, auth_1.auth)('admin'), admin_controller_1.AdminControllers.getSingleBlog);
// Route to make a blog post private (requires admin authentication)
router.patch('/blogs/:id/private', (0, auth_1.auth)('admin'), admin_controller_1.AdminControllers.privateTheBlog);
// Route to delete a blog post (requires admin authentication)
router.delete('/blogs/:id', (0, auth_1.auth)('admin'), admin_controller_1.AdminControllers.deleteBlog);
// Exporting all admin routes
exports.AdminRoutes = router;
