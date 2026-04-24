import type { Application, Request, Response } from 'express'
import { getDb, queryCollection, queryRecord } from '../lib'
import { authMiddleware } from '../middleware'
import { generateUniqueSlug } from '../utils/slug-generator'

export function registerEquipmentPropsRoutes(app: Application) {
  // * GET /equipment-props
  app.get('/api/equipment-props', authMiddleware, (req: Request, res: Response) => {
    const result = queryCollection('equipment_props', req.query, res)
    return res.status(200).json(result)
  })

  // * GET /equipment-props/:id
  app.get('/api/equipment-props/:id', authMiddleware, (req: Request, res: Response) => {
    const result = queryRecord('equipment_props', Number(req.params.id), req.query)
    if (!result) return res.status(404).json({ message: 'Equipment props not found' })
    return res.status(200).json(result)
  })

  // * POST /equipment-props
  app.post('/api/equipment-props', authMiddleware, (req: Request, res: Response) => {
    const { name, category_id, rental_price_per_day, weight_kg, dimensions, is_fragile, description, image_ids, tags } =
      req.body

    if (!name || !category_id || !rental_price_per_day) {
      return res.status(400).json({
        message: 'name, category_id and rental_price_per_day are required',
      })
    }

    const db = getDb()
    const generatedSlug = generateUniqueSlug(name, 'equipment_props', db)

    const newEquipment = {
      name,
      slug: generatedSlug,
      category_id,
      rental_price_per_day,
      weight_kg: weight_kg ?? null,
      dimensions: dimensions ?? null,
      is_fragile: is_fragile ?? false,
      description: description ?? null,
      image_ids: Array.isArray(image_ids) ? image_ids : [],
      tags: Array.isArray(tags) ? tags : [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: null,
    }

    const created = db.get('equipment_props').insert(newEquipment).write()
    return res.status(201).json(created)
  })

  // * PATCH /equipment-props/:id
  app.patch('/api/equipment-props/:id', authMiddleware, (req: Request, res: Response) => {
    const db = getDb()
    const id = Number(req.params.id)

    const existing = db.get('equipment_props').find({ id }).value()
    if (!existing) {
      return res.status(404).json({ message: 'Equipment props not found' })
    }

    const { id: _id, created_at, ...updateData } = req.body

    // Auto-generate slug if name is being updated
    if (updateData.name) {
      updateData.slug = generateUniqueSlug(updateData.name, 'equipment_props', db, id)
    }

    // Convert single values to arrays if needed
    if (updateData.image_ids && !Array.isArray(updateData.image_ids)) {
      updateData.image_ids = [updateData.image_ids]
    }
    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = [updateData.tags]
    }

    const updated = db
      .get('equipment_props')
      .find({ id })
      .assign({ ...updateData, updated_at: new Date().toISOString() })
      .write()

    return res.status(200).json(updated)
  })

  // * DELETE /equipment-props/:id
  app.delete('/api/equipment-props/:id', authMiddleware, (req: Request, res: Response) => {
    const db = getDb()
    const id = Number(req.params.id)

    const existing = db.get('equipment_props').find({ id }).value()
    if (!existing) {
      return res.status(404).json({ message: 'Equipment props not found' })
    }

    if (req.query.permanantly && JSON.parse(req.query.permanantly as string)) {
      db.get('equipment_props').remove({ id }).write()
    } else {
      db.get('equipment_props').find({ id }).assign({ is_active: false, updated_at: new Date().toISOString() }).write()
    }

    return res.status(200).json({
      message: 'Equipment props deleted successfully',
    })
  })
}
