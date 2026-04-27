# 🎭 Costume Rental - Hệ Thống Quản Lý Cho Thuê Trang Phục

![status](https://img.shields.io/badge/status-active-brightgreen)
![version](https://img.shields.io/badge/version-1.0.0-blue)
![license](https://img.shields.io/badge/license-MIT-green)

Đây là hệ thống web hiện đại để quản lý toàn bộ quy trình cho thuê trang phục với giao diện thân thiện, tính năng quản lý kho mạnh mẽ, và báo cáo chi tiết.

## 🚀 Bắt Đầu Nhanh

```bash
# Cài đặt dependencies
bun install

# Khởi động mock server
bun run json-server

# Khởi động dev server (terminal khác)
bun run dev

# Truy cập http://localhost:5000
```

**⏱️ Thời gian thiết lập: ~5 phút**

> 📖 Chi tiết hơn? Xem [ONBOARDING.md](ONBOARDING.md)

---

## 📚 Tài Liệu

Dự án có hệ thống tài liệu toàn diện cho từng vai trò:

### 👨‍💻 Cho Senior Frontend Developers

- **[ONBOARDING.md](ONBOARDING.md)** ⭐ _Bắt đầu từ đây_
  - Thiết lập môi trường
  - Chạy dự án
  - Hệ thống tệp toàn bộ
  - Troubleshooting

- **[ARCHITECTURE.md](ARCHITECTURE.md)**
  - Kiến trúc ứng dụng
  - Data flow
  - Cấu trúc module
  - Patterns & best practices

- **[DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)**
  - Git workflow
  - Feature development cycle
  - Testing strategies
  - Code review process

- **[API_GUIDELINES.md](API_GUIDELINES.md)**
  - Hook conventions
  - API patterns
  - Validation schemas
  - Cache strategies

### 🎯 Quick Links

| Cần làm gì?             | Xem                                                                |
| ----------------------- | ------------------------------------------------------------------ |
| Thiết lập dự án lần đầu | [ONBOARDING.md#thiết-lập-ban-đầu](ONBOARDING.md#thiết-lập-ban-đầu) |
| Hiểu cấu trúc folder    | [ONBOARDING.md#cấu-trúc-dự-án](ONBOARDING.md#cấu-trúc-dự-án)       |
| Tạo feature mới         | [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)                 |
| Viết custom hook        | [API_GUIDELINES.md](API_GUIDELINES.md)                             |
| Hiểu data flow          | [ARCHITECTURE.md](ARCHITECTURE.md)                                 |
| Chạy tests              | [ONBOARDING.md#testing](ONBOARDING.md#testing)                     |
| Fix lỗi                 | [ONBOARDING.md#khắc-phục-sự-cố](ONBOARDING.md#khắc-phục-sự-cố)     |

---

## 🏗️ Stack Công Nghệ

### Frontend

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TanStack Router** - Client-side Routing
- **React Query** - Data Fetching & Caching
- **React Form** - Form State Management
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State Management
- **TipTap** - Rich Text Editor

### Backend (Development)

- **Bun** - JavaScript Runtime
- **Express** - Web Framework
- **JSON Server** - Mock Database
- **Nitro** - Backend Framework

### DevTools & Quality

- **Vite** - Module Bundler
- **Vitest** - Unit Testing
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **TypeScript** - Type Checking

---

## 📂 Cấu Trúc Dự Án

```
costume-rental/
├── 📖 Documentation
│   ├── ONBOARDING.md              # Hướng dẫn thiết lập
│   ├── ARCHITECTURE.md            # Kiến trúc ứng dụng
│   ├── DEVELOPMENT_WORKFLOW.md    # Quy trình phát triển
│   └── API_GUIDELINES.md          # Convention & Patterns
│
├── src/
│   ├── routes/                    # TanStack Router Pages
│   ├── apis/                      # Feature Modules (API Hooks)
│   ├── components/                # Reusable Components
│   ├── stores/                    # Zustand State
│   ├── hooks/                     # Custom React Hooks
│   ├── lib/                       # Utility Functions
│   ├── configs/                   # Configuration
│   └── common/                    # Shared Types & Constants
│
├── mock/                          # Mock Backend
│   ├── app.ts                     # Server Entry
│   ├── db.json                    # Mock Database
│   ├── routes/                    # API Routes
│   └── utils/                     # Helper Functions
│
├── public/                        # Static Files
└── [Config Files]
```

---

## 📝 Scripts Chính

```bash
# Development
bun run dev              # Vite dev server (port 5000)
bun run json-server     # Mock backend (port 8000)

# Quality
bun run lint            # ESLint checks
bun run format          # Prettier formatting
bun run typecheck       # TypeScript checking

# Testing
bun run test            # Run Vitest
bun run test -- --watch # Watch mode

# Production
bun run build           # Production build
bun run preview         # Preview build locally
```

---

## 🌐 Truy Cập

| Service              | URL                   | Mục Đích      |
| -------------------- | --------------------- | ------------- |
| Frontend             | http://localhost:5000 | Ứng dụng web  |
| Backend API          | http://localhost:8000 | REST API      |
| React Query DevTools | http://localhost:5000 | Debug queries |

---

## 🧪 Testing

```bash
# Chạy toàn bộ tests
bun run test

# Watch mode
bun run test -- --watch

# Coverage report
bun run test -- --coverage
```

---

## 🐛 Troubleshooting

### Port bị chiếm

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies mismatch

```bash
rm -rf node_modules bun.lockb
bun install --force
```

### TypeScript errors

```bash
bun run typecheck
```

> 📖 Chi tiết: [ONBOARDING.md#khắc-phục-sự-cố](ONBOARDING.md#khắc-phục-sự-cố)

---

## 📚 Learning Resources

### Internal Documentation

- [ONBOARDING.md](ONBOARDING.md) - Setup & Getting Started
- [ARCHITECTURE.md](ARCHITECTURE.md) - System Design
- [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) - Development Process
- [API_GUIDELINES.md](API_GUIDELINES.md) - Hook & API Conventions

### External Resources

- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Router](https://tanstack.com/router/latest)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎓 Onboarding Checklist

Nếu bạn là thành viên mới:

- [ ] Đọc [ONBOARDING.md](ONBOARDING.md) ⭐
- [ ] Clone repository
- [ ] Cài đặt dependencies: `bun install`
- [ ] Tạo `.env.local`
- [ ] Chạy mock server: `bun run json-server`
- [ ] Chạy dev server: `bun run dev`
- [ ] Truy cập http://localhost:5000
- [ ] Khám phá cấu trúc dự án
- [ ] Chạy tests: `bun run test`
- [ ] Tạo feature branch và thử phát triển

---

## 🎉 Let's Build Together!

Bắt đầu bằng cách đọc **[ONBOARDING.md](ONBOARDING.md)**.

**Happy Coding! 👨‍💻**

---

_Last Updated: April 2026_  
_For Senior Frontend Developers_

### Dependencies Mismatch

```bash
# Clear cache và reinstall
rm -rf node_modules bun.lockb
bun install --force
```

### Type Errors in IDE

```bash
# Rebuild TypeScript
bun run typecheck

# Reload VS Code: Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
```

### Mock Server Not Responding

```bash
# Kiểm tra process
lsof -i :8000

# Kill và restart
bun run json-server
```

### Build Errors

```bash
# Clear Vite cache
rm -rf .vite dist
bun run build
```

### Network Issues

```env
# Tăng timeout nếu API chậm
VITE_API_TIMEOUT=30000

# Kiểm tra kết nối
curl http://localhost:8000/api/health
```

---

## 📚 Tài Liệu & Tham Khảo

### Official Documentation

- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Router](https://tanstack.com/router/latest)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Bun Runtime](https://bun.sh)

### Project-Specific Guides

- **API Integration**: See `src/apis/*/hooks` for patterns
- **Component Library**: Check `src/components/ui` for shadcn components
- **Validation**: See `src/apis/*/schemas` for Zod examples
- **State Management**: Check `src/stores` for Zustand patterns

### Code Examples

```typescript
// Data Fetching Pattern
const { data, isLoading, error } = useListCostumes({ page: 1 })

// Form Validation Pattern
const schema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
})
type FormData = z.infer<typeof schema>

// Component Pattern
export function FeatureName() {
  return <div>Component</div>
}
```

---

## ✅ Checklist Onboarding

- [ ] Clone repository
- [ ] Cài đặt dependencies (`bun install`)
- [ ] Tạo `.env.local`
- [ ] Chạy type check (`bun run typecheck`)
- [ ] Start mock server (`bun run json-server`)
- [ ] Start dev server (`bun run dev`)
- [ ] Truy cập http://localhost:5000
- [ ] Đăng nhập với test account
- [ ] Khám phá cấu trúc project
- [ ] Đọc một feature module để hiểu pattern
- [ ] Chạy tests (`bun run test`)
- [ ] Thực hành tạo một feature branch

---

## 💬 Cần Giúp Đỡ?

- 📧 **Email Team Lead**: [contact info]
- 💬 **Slack Channel**: #costume-rental-dev
- 📋 **Issue Tracker**: GitHub Issues
- 📖 **Wiki**: Project Documentation

---

**Happy Coding! 🎉**

_Last Updated: April 2026_
_For Senior Frontend Developers_
