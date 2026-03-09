# MVP Contract Management System

Simple internal Contract Management System with JWT login, role-based access, contract CRUD, file upload, dashboard stats, and audit fields.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- DB: PostgreSQL
- DB Client: `pg`
- Auth: JWT
- Uploads: local folder (`backend/src/uploads`)

## Project Structure
```
backend/
frontend/
```

## 1) Prerequisites
- Node.js 18+
- PostgreSQL 13+

## 2) Database Setup
Create DB:
```bash
createdb contract_management
```

Run schema:
```bash
psql -d contract_management -f backend/sql/schema.sql
```

## 3) Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:5000`

## 4) Frontend Setup
Open new terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Default Seed Users
- Admin
  - email: `admin@example.com`
  - password: `admin123`
- Staff
  - email: `staff@example.com`
  - password: `staff123`

## API Endpoints
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/contracts`
- `GET /api/contracts/:id`
- `POST /api/contracts`
- `PUT /api/contracts/:id` (Admin only)
- `DELETE /api/contracts/:id` (Admin only)
- `POST /api/contracts/:id/upload`
- `GET /api/contracts/dashboard/stats`

## Business Rules Implemented
- JWT-protected contract routes
- Admin: create, edit, delete
- Staff: view, create, upload (no delete/edit)
- Expiring Soon = `end_date` within 30 days
- Audit fields: `created_by`, `created_at`, `updated_at`

## Sample API Tests (cURL)
Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Get contracts:
```bash
curl http://localhost:5000/api/contracts \
  -H "Authorization: Bearer <TOKEN>"
```

Create contract:
```bash
curl -X POST http://localhost:5000/api/contracts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "contract_no":"C-001",
    "title":"Software License",
    "vendor_name":"Acme Corp",
    "department":"IT",
    "start_date":"2026-01-01",
    "end_date":"2026-12-31",
    "amount":15000,
    "status":"Active",
    "description":"Annual enterprise software license"
  }'
```

Upload file:
```bash
curl -X POST http://localhost:5000/api/contracts/1/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/contract.pdf"
```
