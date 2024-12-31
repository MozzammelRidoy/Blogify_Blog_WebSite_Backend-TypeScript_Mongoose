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
exports.BlogServices = void 0;
const blog_model_1 = require("./blog.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const blog_constant_1 = require("./blog.constant");
// Create a new blog in the database
const createBlogIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    payload.author = user.userId;
    const result = yield blog_model_1.Blog.create(payload);
    return result;
});
// Fetch all blogs with optional search, filter, and sort
const getAllBlogsFromDB = (qurery) => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize the query builder with the Blog model
    const blogQuery = new QueryBuilder_1.default(blog_model_1.Blog.find().populate('author', 'name'), qurery)
        .search(blog_constant_1.blogSearchableFileds)
        .filter('author')
        .sort();
    const result = yield blogQuery.modelQuery;
    return result;
});
// Update a blog, ensuring the user is the owner and the blog is not private
const updateBlogIntoDB = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the current user is the author of the blog
    const blogOwner = yield blog_model_1.Blog.findOne({ _id: id, author: user.userId }, {}, { skipMiddleware: true });
    if (!blogOwner) {
        throw new AppError_1.default(404, 'Blog not found');
    }
    // Check if the blog is private
    const isPrivate = yield blog_model_1.Blog.isBlogIsPrivate(id, user.userId);
    if (!isPrivate) {
        throw new AppError_1.default(400, 'This blog is private! You can not modify it.');
    }
    const result = yield blog_model_1.Blog.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
// Delete a blog, ensuring the user is the owner
const deleteBlogFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the current user is the author of the blog
    const blogOwner = yield blog_model_1.Blog.findOne({ _id: id, author: user.userId }, {}, { skipMiddleware: true });
    if (!blogOwner) {
        throw new AppError_1.default(404, 'Blog not found');
    }
    // Delete the blog from the database
    yield blog_model_1.Blog.findByIdAndDelete(id);
});
// Export the Blog services
exports.BlogServices = {
    createBlogIntoDB,
    getAllBlogsFromDB,
    updateBlogIntoDB,
    deleteBlogFromDB
};
