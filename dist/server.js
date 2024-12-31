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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const app_1 = __importDefault(require("./app"));
let server;
// Main function to initialize the app and connect to the database
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connecting to the database
            yield mongoose_1.default.connect(config_1.default.database_url);
            // Starting the server
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`Example app listening on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            console.log('Error From Server', err);
        }
    });
}
main();
// Handling unhandled promise rejections
process.on('unhandledRejection', () => {
    console.log('😡 Unhandle Rejection is Detected. Shutting Down....');
    // Closing the server gracefully in case of unhandled rejection
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Handling uncaught exceptions
process.on('uncaughtException', () => {
    console.log('😡 Uncaught Exception is Detected. Shutting Down....');
    process.exit(1);
});