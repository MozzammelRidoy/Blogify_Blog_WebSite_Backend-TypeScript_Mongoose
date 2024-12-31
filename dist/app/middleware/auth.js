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
exports.auth = void 0;
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Authorization Middleware: Checks if the user is authorized and has the required role(s)
const auth = (...requeredRole) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Extract token from authorization header
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        // Check if token exists
        if (!token) {
            throw new AppError_1.default(401, 'You are not authorized!');
        }
        // Verify and decode the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token_secret);
        const { userId, role } = decoded;
        // Check if user exists in the database
        const user = yield user_model_1.User.isUserExistsBy_id(userId);
        if (!user) {
            throw new AppError_1.default(401, 'Invalid credentials');
        }
        // Check if the user is deleted
        const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
        if (isDeleted) {
            throw new AppError_1.default(404, 'User not found!');
        }
        // Check if the user is blocked
        const isBlocked = user === null || user === void 0 ? void 0 : user.isBlocked;
        if (isBlocked) {
            throw new AppError_1.default(400, 'User is blocked!');
        }
        // Check if the user has the required role
        if (user.role !== role) {
            throw new AppError_1.default(403, 'You are not authorized!');
        }
        // Check if the user role matches any of the required roles
        if (requeredRole && !requeredRole.includes(role)) {
            throw new AppError_1.default(401, 'You are not authorized!');
        }
        // Attach the decoded user data to the request object
        req.user = decoded;
        next();
    }));
};
exports.auth = auth;
