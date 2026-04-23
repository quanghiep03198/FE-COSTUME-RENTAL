import { WorkStatus } from '@/apis/employee/constants'
import generateAvatar from '@/lib/generate-avatar'
import bcrypt from 'bcryptjs'
import type { Application, Request, Response } from 'express'
import jsonServer, { type JsonServerRouter } from 'json-server'
import jwt from 'jsonwebtoken'
import { generateEmployeeCode } from './helpers'
import { bootstrap, getDb, queryCollection, queryRecord } from './lib'
import { authMiddleware } from './middleware'

const app = jsonServer.create() as Application & { db: JsonServerRouter<object>['db'] }
const middlewares = jsonServer.defaults()
export const router = jsonServer.router('mock/db.json')

// Initialize query helpers with the router instance
bootstrap(router)

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '10s'

function getTokenFromCookieHeader(cookieHeader?: string) {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [rawName, ...rawValue] = cookie.trim().split('=')
    if (rawName !== 'accessToken') continue

    const token = rawValue.join('=')
    return token ? decodeURIComponent(token) : null
  }

  return null
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

// Bind the router db to the app (required for json-server-auth)
app.db = router.db

app.use(middlewares)
app.use(jsonServer.bodyParser)

// * Custom route: POST /login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username/email and password are required' })
  }

  const db = router.db as any
  const user = db
    .get('users')
    .find((u: any) => u.username === username)
    .value()

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  if (!user.is_active)
    return res.status(403).json({
      message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.',
    })

  const accessToken = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN,
  })

  res.cookie('accessToken', accessToken, cookieOptions)

  const { password: _, ...userWithoutPassword } = user

  return res.status(200).json({
    accessToken,
    user: {
      ...userWithoutPassword,
      avatar: generateAvatar({ name: userWithoutPassword.display_name }),
    },
  })
})

// * Custom route: POST /register
app.post('/api/register', (req: Request, res: Response) => {
  const { username, email, password, display_name, role = 'USER' } = req.body

  if (!username || !email || !password || !display_name) {
    return res.status(400).json({
      message: 'username, email, password and display_name are required',
    })
  }

  const db = router.db as any
  const existingUser = db
    .get('users')
    .find((u: any) => u.username === username || u.email === email)
    .value()

  if (existingUser) {
    return res.status(409).json({ message: 'Username or email already exists' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const newUser = {
    username,
    email,
    password: hashedPassword,
    display_name,
    role,
    employee_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: null,
  }

  const created = db.get('users').insert(newUser).write()
  const { password: _, ...userWithoutPassword } = created

  return res.status(201).json({
    ...userWithoutPassword,
    avatar: generateAvatar({ name: userWithoutPassword.display_name }),
  })
})

// * Custom route: POST /logout
app.post('/api/auth/logout', authMiddleware, (req: Request, res: Response) => {
  const token = (req as any).token
  const db = router.db as any

  db.get('revoke_tokens').push({ access_token: token }).write()
  res.clearCookie('accessToken', { path: '/' })

  return res.status(200).json({ message: 'Logged out successfully' })
})

// * Custom route: GET /refresh
app.get('/api/auth/refresh', (req: Request, res: Response) => {
  try {
    const expiredAccessToken = getTokenFromCookieHeader(req.headers.cookie)

    if (!expiredAccessToken) return res.status(403).json({ message: 'Invalid access token' })

    const tokenPart = expiredAccessToken.split('.').at(1)
    if (!tokenPart) return res.status(403).json({ message: 'Invalid access token format' })

    const payload = JSON.parse(atob(tokenPart))

    const db = router.db as any
    const user = db.get('users').find({ id: payload?.sub }).value()

    if (!user) {
      return res.status(403).json({ message: 'User not found' })
    }

    // Revoke old token
    db.get('revoke_tokens').push({ access_token: expiredAccessToken }).write()

    // Issue new token
    const accessToken = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET!, {
      expiresIn: JWT_EXPIRES_IN,
    })

    res.cookie('accessToken', accessToken, cookieOptions)

    console.log(__filename, 'Refresh token :>>', accessToken)

    return res.status(200).json({ accessToken })
  } catch (error) {
    return res.status(403).json(error)
  }
})

// * Custom route: GET /auth/me
app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
  const payload = (req as any).user
  const user = (router.db as any).get('users').find({ id: payload.sub }).value()

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const employee = router.db.get('employees').find({ id: user.employee_id }).value()

  const { password, ...userWithoutPassword } = user
  return res.status(200).json({
    ...userWithoutPassword,
    employee,
    avatar: generateAvatar({ name: employee?.full_name }),
  })
})

const addAvatar = (r: any) => ({
  ...r,
  avatar: generateAvatar({ name: r.employee?.full_name }),
})
const userOpts = { omit: ['password'], transform: addAvatar }

// * Custom route: GET /users
app.get('/api/users', authMiddleware, (req: Request, res: Response) => {
  const result = queryCollection('users', req.query, res, userOpts)
  return res.status(200).json(result)
})

// * Custom route: GET /users/:id
app.get('/api/users/:id', authMiddleware, (req: Request, res: Response) => {
  const result = queryRecord('users', Number(req.params.id), req.query, userOpts)
  if (!result) return res.status(404).json({ message: 'User not found' })
  return res.status(200).json(result)
})

app.post('/api/users', authMiddleware, (req: Request, res: Response) => {
  const { username, password, employee_id, role = 'USER' } = req.body

  if (!username) {
    return res.status(400).json({
      message: 'username, email, password and display_name are required',
    })
  }

  const db = router.db as any
  const existingUser = db
    .get('users')
    .find((u: any) => u.username === username)
    .value()

  if (existingUser) {
    return res.status(409).json({ message: 'Username or email already exists' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)
  const newUser = {
    username,
    password: hashedPassword,
    role,
    employee_id,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: null,
  }

  const created = db.get('users').insert(newUser).write()
  const { password: _, ...userWithoutPassword } = created

  const employee = db.get('employees').find({ id: created.employee_id }).value()

  return res.status(201).json({
    ...userWithoutPassword,
    avatar: generateAvatar({ name: employee?.full_name }),
  })
})

app.patch('/api/users/update/:id', authMiddleware, (req: Request, res: Response) => {
  const db = getDb()
  const id = Number(req.params.id)

  const existing = db.get('users').find({ id }).value()
  if (!existing) {
    return res.status(404).json({ message: 'User not found' })
  }

  // Prevent updating sensitive/immutable fields
  const { password, id: _id, created_at, ...updateData } = req.body

  // Check duplicate username/email if being changed
  if (updateData.username || updateData.email) {
    const duplicate = db
      .get('users')
      .find((u: any) => {
        if (u.id === id) return false
        return (
          (updateData.username && u.username === updateData.username) ||
          (updateData.email && u.email === updateData.email)
        )
      })
      .value()

    if (duplicate) {
      return res.status(409).json({ message: 'Username or email already exists' })
    }
  }

  const updated = db
    .get('users')
    .find({ id })
    .assign({ ...updateData, updated_at: new Date().toISOString() })
    .write()

  const { password: _, ...userWithoutPassword } = updated

  return res.status(200).json({
    ...userWithoutPassword,
    avatar: generateAvatar({ name: userWithoutPassword.display_name }),
  })
})

app.delete('/api/users/:id', authMiddleware, (req: Request, res: Response) => {
  const db = getDb()
  const id = Number(req.params.id)
  const existing = db.get('users').find({ id }).value()
  if (!existing) {
    return res.status(404).json({ message: 'User not found' })
  }

  db.get('users').remove({ id }).write()

  return res.status(200).json({
    message: 'User deleted successfully',
    user: db.get('users').find({ id }),
  })
})

// ============================================================
// Employees CRUD
// ============================================================

// * GET /employees
app.get('/api/employees', authMiddleware, (req: Request, res: Response) => {
  const result = queryCollection('employees', req.query, res)
  return res.status(200).json(result)
})

// * GET /employees/:id
app.get('/api/employees/:id', authMiddleware, (req: Request, res: Response) => {
  const result = queryRecord('employees', Number(req.params.id), req.query)
  if (!result) return res.status(404).json({ message: 'Employee not found' })
  return res.status(200).json(result)
})

// * POST /employees
app.post('/api/employees/create', authMiddleware, (req: Request, res: Response) => {
  const { full_name, phone, email, address, citizen_id_number, position, work_status = WorkStatus.ACTIVE } = req.body

  const db = getDb()
  const newEmployee = {
    employee_code: '',
    full_name,
    phone: phone ?? null,
    email,
    address: address ?? null,
    work_status,
    citizen_id_number,
    user_id: null,
    is_active: true,
    position,
    created_at: new Date().toISOString(),
    updated_at: null,
  }

  const created = db.get('employees').insert(newEmployee).write()
  db.get('employees')
    .find({ id: created.id })
    .assign({ employee_code: generateEmployeeCode(created.id) })
    .write()
  return res.status(201).json(db.get('employees').find({ id: created.id }).value())
})

// * PATCH /employees/:id
app.patch('/api/employees/update/:id', authMiddleware, (req: Request, res: Response) => {
  const db = getDb()
  const id = Number(req.params.id)

  const existing = db.get('employees').find({ id }).value()
  if (!existing) {
    return res.status(404).json({ message: 'Employee not found' })
  }

  // Prevent updating immutable fields
  const { id: _id, employee_code, created_at, ...updateData } = req.body

  const updated = db
    .get('employees')
    .find({ id })
    .assign({
      ...updateData,
      updated_at: new Date().toISOString(),
      is_active: updateData.work_status !== WorkStatus.EXITED,
    })
    .write()

  return res.status(200).json(updated)
})

// * DELETE /employees/:id
app.delete('/api/employees/delete/:id', authMiddleware, (req: Request, res: Response) => {
  const db = getDb()
  const id = Number(req.params.id)

  const existing = db.get('employees').find({ id }).value()
  if (!existing) {
    return res.status(404).json({ message: 'Employee not found' })
  }

  if (req.query.permanantly && JSON.parse(req.query.permanantly as string)) {
    db.get('employees').remove({ id }).write()
    // Unlink user if linked
    db.get('users').find({ employee_id: id }).assign({ employee_id: null }).write()
  } else {
    db.get('employees').find({ id }).assign({ is_active: false, updated_at: new Date().toISOString() }).write()
  }

  return res.status(200).json({
    message: 'Employee deleted successfully',
    employee: db.get('employees').find({ id }),
  })
})

const PORT = 5001
app.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})
