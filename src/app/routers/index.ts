import { Router } from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { BlogRoutes } from '../modules/blog/blog.route'
import { AdminRoutes } from '../modules/admin/admin.route'

const routers = Router()

// Define an array of module routes with paths and corresponding route handlers
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/blogs',
    route: BlogRoutes
  },
  {
    path: '/admin',
    route: AdminRoutes
  }
]

// Loop through the module routes and use the respective route handlers for each path
moduleRoutes.forEach(route => {
  routers.use(route.path, route.route)
})
export default routers
