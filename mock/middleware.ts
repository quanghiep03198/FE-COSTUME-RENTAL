// Auth middleware: verify token + check revoked
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { router } from './app'

const JWT_SECRET = process.env.JWT_SECRET

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Missing or invalid authorization header' })
  }

  const accessToken = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET!) as jwt.JwtPayload

    const db = router.db as any
    const isRevoked = db.get('revoke_tokens').find({ access_token: accessToken }).value()
    if (isRevoked) {
      return res.status(403).json({ message: 'Token has been revoked' })
    }

    ;(req as any).user = payload
    ;(req as any).token = accessToken
    return next()
  } catch (e) {
    // console.error(e)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
