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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_constant_1 = require("./user.constant");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
// Define the User schema
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        select: 0
    },
    role: {
        type: String,
        enum: user_constant_1.UserRole,
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Check if user exists by email (with password selection)
UserSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select('+password');
    });
};
// Check if user exists by ID (with password selection)
UserSchema.statics.isUserExistsBy_id = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id, {}, { skipMiddleware: true }).select('+password');
    });
};
// Pre-save middleware for hashing the user's password
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// Post-save middleware for removing the password from the document after saving
UserSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
// Check if password matches using bcrypt
UserSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
// Check if the user is already marked as deleted
UserSchema.statics.isUserAlreadyDeleted = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isDeleted = yield exports.User.findById(id, {}, { skipMiddleware: true });
        return isDeleted === null || isDeleted === void 0 ? void 0 : isDeleted.isDeleted;
    });
};
// Middleware to exclude deleted users from `find` operations unless skipped
UserSchema.pre('find', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const skipMiddleware = this.getOptions().skipMiddleware;
        if (!skipMiddleware) {
            this.find({ isDeleted: { $ne: true } });
        }
        next();
    });
});
// Middleware to exclude deleted users from `findOne` operations unless skipped
UserSchema.pre('findOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const skipMiddleware = this.getOptions().skipMiddleware;
        if (!skipMiddleware) {
            this.findOne({ isDeleted: { $ne: true } });
        }
        next();
    });
});
// Middleware to exclude deleted users from aggregation operations
UserSchema.pre('aggregate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
        next();
    });
});
// Add a full-text index on name, email, and role fields
UserSchema.index({ name: 'text', email: 'text', role: 'text' });
// Create the User model based on the schema
exports.User = mongoose_1.default.model('User', UserSchema);
