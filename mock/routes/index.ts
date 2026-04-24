import type { Application } from 'express'
import { registerAuthRoutes } from './auth.routes'
import { registerCostumeRoutes } from './costume.routes'
import { registerEmployeeRoutes } from './employee.routes'
import { registerEquipmentPropsRoutes } from './equipment-props.routes'
import { registerImageGalleryRoutes } from './image-gallery.routes'
import { registerItemCategoryRoutes } from './item-category.routes'
import { registerUserRoutes } from './user.routes'
import { registerWarehouseRoutes } from './warehouse.routes'

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
