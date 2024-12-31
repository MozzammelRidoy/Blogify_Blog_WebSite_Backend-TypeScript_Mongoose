"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
// Export configuration settings from environment variables
exports.default = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    port: process.env.PORT || 5000,
    database_url: process.env.DATA_BASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
    jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwt_access_token_expiry: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    jwt_refresh_token_expiry: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
};
