"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
// Controller to fetch all users
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getAllUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Users fetched successfully',
        data: result || 'not found!'
    });
}));
// Controller to fetch a single user
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield admin_service_1.AdminServices.getSingleUserFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User fetched successfully',
        data: result || 'not found!'
    });
}));
// Controller to block a user
const userBlocked = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield admin_service_1.AdminServices.userBlockedIntoDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User blocked successfully',
        data: result
    });
}));
// Controller to delete a user
const userDeleted = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield admin_service_1.AdminServices.userDeletedIntoDB(userId, next);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
        data: result
    });
}));
// =================== Blog Related Controllers ===================
// Controller to fetch a single blog
const getSingleBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.getSingleBlogFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Blog fetched successfully',
        data: result || 'not found'
    });
}));
// Controller to private a single blog
const privateTheBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.privateTheBlogIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: (result === null || result === void 0 ? void 0 : result.message) ? result.message : 'Blog Privated successfully',
        data: (result === null || result === void 0 ? void 0 : result.message) || result
    });
}));
// Controller to delete a blog post
const deleteBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.AdminServices.deleteBlogPostIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: (result === null || result === void 0 ? void 0 : result.message) ? result.message : 'Blog deleted successfully',
        data: (result === null || result === void 0 ? void 0 : result.message) || result
    });
}));
// Exporting all admin controllers
exports.AdminControllers = {
    getAllUsers,
    getSingleUser,
    userBlocked,
    userDeleted,
    getSingleBlog,
    privateTheBlog,
    deleteBlog
};
