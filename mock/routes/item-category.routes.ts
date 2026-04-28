import type { Application, Request, Response } from 'express'
import { getDb, queryCollection, queryRecord } from '../lib'
import { jwtMiddleware } from '../middleware'
import { generateUniqueSlug } from '../utils/slug-generator'

export function registerItemCategoryRoutes(app: Application) {
  // * GET /categories
  app.get('/api/categories', jwtMiddleware, (req: Request, res: Response) => {
    const result = queryCollection('categories', req.query, res)
    return res.status(200).json(result)
  })

  // * GET /categories/:id
  app.get('/api/categories/:id', jwtMiddleware, (req: Request, res: Response) => {
    const result = queryRecord('categories', Number(req.params.id), req.query)
    if (!result) return res.status(404).json({ message: 'Item category not found' })
    return res.status(200).json(result)
  })

  // * POST /categories
  app.post('/api/categories', jwtMiddleware, (req: Request, res: Response) => {
    const { name, type } = req.body

    if (!name || !type) {
      return res.status(400).json({
        message: 'name, type are required',
      })
    }

    const db = getDb()
    const generatedSlug = generateUniqueSlug(name, 'categories', db)

    const newCategory = {
      name,
      slug: generatedSlug,
      type,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: null,
    }

    const created = db.get('categories').insert(newCategory).write()
    return res.status(201).json(created)
  })

  // * PATCH /categories/:id
  app.patch('/api/categories/:id', jwtMiddleware, (req: Request, res: Response) => {
    const db = getDb()
    const id = Number(req.params.id)

    const existing = db.get('categories').find({ id }).value()
    if (!existing) {
      return res.status(404).json({ message: 'Item category not found' })
    }

    const { id: _id, created_at, ...updateData } = req.body

    // Auto-generate slug if name is being updated
    if (updateData.name) {
      updateData.slug = generateUniqueSlug(updateData.name, 'categories', db, id)
    }

    const updated = db
      .get('categories')
      .find({ id })
      .assign({ ...updateData, updated_at: new Date().toISOString() })
      .write()

    return res.status(200).json(updated)
  })

  // * DELETE /categories/:id
  app.delete('/api/categories/:id', jwtMiddleware, (req: Request, res: Response) => {
    const db = getDb()
    const id = Number(req.params.id)

    const existing = db.get('categories').find({ id }).value()
    if (!existing) {
      return res.status(404).json({ message: 'Item category not found' })
    }

    if (req.query.permanantly && JSON.parse(req.query.permanantly as string)) {
      db.get('categories').remove({ id }).write()
    } else {
      db.get('categories').find({ id }).assign({ is_active: false, updated_at: new Date().toISOString() }).write()
    }

    return res.status(200).json({
      message: 'Item category deleted successfully',
    })
  })
}
