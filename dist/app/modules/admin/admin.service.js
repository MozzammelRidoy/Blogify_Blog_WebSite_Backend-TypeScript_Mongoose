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
exports.AdminServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const blog_model_1 = require("../blog/blog.model");
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
// Service to fetch all users with applied query filters
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(user_constant_1.userSearchableFields)
        .filter('email')
        .sort();
    const result = yield userQuery.modelQuery;
    return result;
});
// Service to fetch a single user by ID
const getSingleUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield user_model_1.User.isUserAlreadyDeleted(userId)) {
        return 'This user is already deleted!';
    }
    const result = yield user_model_1.User.findById(userId);
    return result;
});
// Service to block a user
const userBlockedIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield user_model_1.User.isUserAlreadyDeleted(id)) {
        throw new AppError_1.default(400, 'This user alredy deleted! You Can not modifed!');
    }
    yield user_model_1.User.findByIdAndUpdate(id, { isBlocked: true });
});
// Service to delete a user and their blog posts
const userDeletedIntoDB = (id, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExistsBy_id(id);
    if (!user) {
        throw new AppError_1.default(404, 'This user is not found!');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(400, 'This user is already deleted! Modifications are not allowed.');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Deactivating all blog posts by this user
        yield blog_model_1.Blog.updateMany({ author: id }, { isPublished: false }, { session });
        // Mark the user as deleted
        yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { session });
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        next(err);
    }
    finally {
        yield session.endSession();
    }
});
// =================== Blog Related Services ===================
// Service to fetch a single blog by ID
const getSingleBlogFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findById(id, {}, { skipMiddleware: true }).populate('author');
    return result;
});
// Service to private a blog post (make it unpublished)
const privateTheBlogIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.isBlogExistsFindById(id);
    if (!blog) {
        return { message: 'Blog not found' };
    }
    yield blog_model_1.Blog.findByIdAndUpdate(id, { isPublished: false });
});
// Service to delete a blog post
const deleteBlogPostIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.isBlogExistsFindById(id);
    if (!blog) {
        return { message: 'Blog not found' };
    }
    yield blog_model_1.Blog.findByIdAndDelete(id);
});
// Exporting all admin services
exports.AdminServices = {
    getAllUsersFromDB,
    getSingleUserFromDB,
    userBlockedIntoDB,
    userDeletedIntoDB,
    getSingleBlogFromDB,
    privateTheBlogIntoDB,
    deleteBlogPostIntoDB
};
