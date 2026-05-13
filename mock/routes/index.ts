import type { Application } from 'express'
import { registerAuthRoutes } from './auth.routes'
import { registerCostumeRoutes } from './costume.route'
import { registerEmployeeRoutes } from './employee.route'
import { registerEquipmentPropsRoutes } from './equipment-props.route'
import { registerImageGalleryRoutes } from './images-gallery.route'
import { registerItemCategoryRoutes } from './item-category.route'
import { registerUserRoutes } from './user.route'
import { registerWarehouseRoutes } from './warehouse.route'

export function registerAllRoutes(app: Application) {
  registerAuthRoutes(app)
  registerUserRoutes(app)
  registerEmployeeRoutes(app)
  registerWarehouseRoutes(app)
  registerItemCategoryRoutes(app)
  registerCostumeRoutes(app)
  registerEquipmentPropsRoutes(app)
  registerImageGalleryRoutes(app)
}
