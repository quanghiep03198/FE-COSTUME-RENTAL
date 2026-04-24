import type { Application, Request, Response } from 'express'
import { getDb, queryCollection, queryRecord } from '../lib'
import { authMiddleware } from '../middleware'
import { generateUniqueSlug } from '../utils/slug-generator'

export function registerCostumeRoutes(app: Application) {
  // * GET /costumes
  app.get('/api/costumes', authMiddleware, (req: Request, res: Response) => {
    const result = queryCollection('costumes', req.query, res)

    return res.status(200).json(result)
  })

  // * GET /costumes/:id
  app.get('/api/costumes/:id', authMiddleware, (req: Request, res: Response) => {
    const result = queryRecord('costumes', Number(req.params.id), req.query)
    if (!result) return res.status(404).json({ message: 'Costume not found' })
    return res.status(200).json(result)
  })

  // * POST /costumes
  app.post('/api/costumes', authMiddleware, (req: Request, res: Response) => {
    const { name, category_id, sizes, gender, image_id, rental_price_per_day, description, tags, color } = req.body

    if (!name || !category_id || !sizes || !gender || !rental_price_per_day) {
      return res.status(400).json({
        message: 'name, category_id, sizes, gender and rental_price_per_day are required',
      })
    }

    if (rental_price_per_day < 50000) {
      return res.status(400).json({
        message: 'rental_price_per_day must be at least 50000',
      })
    }

    const db = getDb()
    const generatedSlug = generateUniqueSlug(name, 'costumes', db)

    const newCostume = {
      slug: generatedSlug,
      name,
      category_id,
      color: color ?? null,
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      gender,
      image_id,
      rental_price_per_day,
      description: description ?? null,
      tags: Array.isArray(tags) ? tags : [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: null,
    }

    const created = db.get('costumes').insert(newCostume).write()
    return res.status(201).json(created)
  })

  // * PATCH /costumes/:id
  app.patch('/api/costumes/:id', authMiddleware, (req: Request, res: Response) => {
    const db = getDb()
    const id = Number(req.params.id)

    const existing = db.get('costumes').find({ id }).value()
    if (!existing) {
      return res.status(404).json({ message: 'Costume not found' })
    }

    if (req.body.rental_price_per_day && req.body.rental_price_per_day < 50000) {
      return res.status(400).json({
        message: 'rental_price_per_day must be at least 50000',
      })
    }

    const { id: _id, created_at, ...updateData } = req.body

    // Auto-generate slug if name is being updated
    if (updateData.name) {
      updateData.slug = generateUniqueSlug(updateData.name, 'costumes', db, id)
    }

    // Convert single values to arrays if needed
    if (updateData.sizes && !Array.isArray(updateData.sizes)) {
      updateData.sizes = [updateData.sizes]
    }
    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = [updateData.tags]
    }

    const updated = db
      .get('costumes')
      .find({ id })
      .assign({ ...updateData, updated_at: new Date().toISOString() })
      .write()

    return res.status(200).json(updated)
  })

  // * DELETE /costumes/:id
  app.delete('/api/costumes/:id', authMiddleware, (req: Request, res: Response) => {
    const db = getDb()
    const id = Number(req.params.id)

    const existing = db.get('costumes').find({ id }).value()
    if (!existing) {
      return res.status(404).json({ message: 'Costume not found' })
    }

    if (req.query.permanantly && JSON.parse(req.query.permanantly as string)) {
      db.get('costumes').remove({ id }).write()
    } else {
      db.get('costumes').find({ id }).assign({ is_active: false, updated_at: new Date().toISOString() }).write()
    }

    return res.status(200).json({
      message: 'Costume deleted successfully',
    })
  })
}
