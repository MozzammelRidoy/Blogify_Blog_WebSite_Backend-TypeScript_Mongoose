"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const blog_route_1 = require("../modules/blog/blog.route");
const admin_route_1 = require("../modules/admin/admin.route");
const routers = (0, express_1.Router)();
// Define an array of module routes with paths and corresponding route handlers
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes
    }
];
// Loop through the module routes and use the respective route handlers for each path
moduleRoutes.forEach(route => {
    routers.use(route.path, route.route);
});
exports.default = routers;
