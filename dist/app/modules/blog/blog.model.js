"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Blog Schema definition with validation rules and references
const BlogSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Author Details is required'],
        ref: 'User'
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Static method to check if a blog exists by its ID
BlogSchema.statics.isBlogExistsFindById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findById(id, {}, { skipMiddleware: true });
    });
};
// Static method to check if a blog is private (not published) for a specific author
BlogSchema.statics.isBlogIsPrivate = function (id, author) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPrivate = yield this.findOne({ _id: id, author }, {}, { skipmiddleware: true });
        return isPrivate === null || isPrivate === void 0 ? void 0 : isPrivate.isPublished;
    });
};
// Pre-hook middleware for 'find' operation to ensure only published blogs are returned
BlogSchema.pre('find', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const skipMiddleware = this.getOptions().skipMiddleware;
        if (!skipMiddleware) {
            this.find({ isPublished: { $ne: false } });
        }
        next();
    });
});
// Pre-hook middleware for 'findOne' operation to ensure only published blogs are returned
BlogSchema.pre('findOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const skipMiddleware = this.getOptions().skipMiddleware;
        if (!skipMiddleware) {
            this.findOne({ isPublished: { $ne: false } });
        }
        next();
    });
});
// Pre-hook middleware for aggregation to ensure only published blogs are processed
BlogSchema.pre('aggregate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.pipeline().unshift({ $match: { isPublished: { $ne: false } } });
        next();
    });
});
// Full-text index for 'title' and 'content' fields to support text search
BlogSchema.index({ title: 'text', content: 'text' });
// Model creation using the Blog schema
exports.Blog = mongoose_1.default.model('Blog', BlogSchema);
