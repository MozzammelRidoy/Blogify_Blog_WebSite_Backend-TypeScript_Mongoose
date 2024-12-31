"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// =================== Token Creation Utility ===================
// Generates a JWT token with the given payload, secret, and expiration time
const createToken = (jwtPayload, jwtSecret, expiresIn) => {
    return jsonwebtoken_1.default.sign(jwtPayload, jwtSecret, { expiresIn });
};
exports.createToken = createToken;
