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
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// =================== User Registration Service ===================
// Handles user registration by adding the user to the database
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user already exists
    if (yield user_model_1.User.isUserExistsByEmail(payload.email)) {
        throw new AppError_1.default(400, 'This user is already exists!');
    }
    // Successfully register the user
    const result = yield user_model_1.User.create(payload);
    return result;
});
// =================== User Login Service ===================
// Handles user login by validating credentials and generating tokens
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists in the database
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        throw new AppError_1.default(403, 'Invalid credentials!');
    }
    // Check if the user is deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(404, 'User Not Found!');
    }
    // Check if the user is blocked
    const isBlocked = user === null || user === void 0 ? void 0 : user.isBlocked;
    if (isBlocked) {
        throw new AppError_1.default(400, 'User is Blocked!');
    }
    // Validate the password
    const isPasswordMatched = yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(403, 'Password do not matched!');
    }
    // Create JWT payload
    const jwtPayload = {
        userId: user._id,
        role: user.role
    };
    // Generate access token
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiry);
    // Generate refresh token
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expiry);
    return {
        accessToken,
        refreshToken
    };
});
// =================== Refresh Token Service ===================
// Validates the refresh token and generates a new access token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // if the token is sent from the client.
    if (!token) {
        throw new AppError_1.default(401, 'You are not authorized.');
    }
    // check if the token is valid.
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_token_secret);
    const { userId } = decoded;
    // Check if the user exists in the database
    const user = yield user_model_1.User.isUserExistsBy_id(userId);
    if (!user) {
        throw new AppError_1.default(403, 'Invalid credentials!');
    }
    // Check if the user is deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(404, 'User Not Found!');
    }
    // Check if the user is blocked
    const isBlocked = user === null || user === void 0 ? void 0 : user.isBlocked;
    if (isBlocked) {
        throw new AppError_1.default(400, 'User is Blocked!');
    }
    // Create JWT payload
    const jwtPayload = {
        userId: user._id,
        role: user.role
    };
    // Generate access token
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiry);
    return {
        accessToken
    };
});
//export Auth Services.
exports.AuthServices = {
    registerUserIntoDB,
    loginUser,
    refreshToken
};
