# Todo App

Full-stack todo application built with `NestJS`, `Next.js`, `Prisma`, and `MongoDB`.

The project includes:

- JWT-based authentication
- User registration and login
- Todo CRUD per authenticated user
- Material UI frontend
- Prisma + MongoDB persistence

## Stack

- Frontend: `Next.js 16`, `React 19`, `Material UI`, `axios`
- Backend: `NestJS 11`, `Prisma`, `bcrypt`, `JWT`
- Database: `MongoDB Atlas`

## Project Structure

```text
todo-app/
├── backend/     NestJS API + Prisma + MongoDB
├── frontend/    Next.js app + Material UI
└── README.md
```

## Features

- Register a new user
- Log in with email and password
- Store JWT in `localStorage`
- Restore session from stored token
- Create todos
- List todos for the logged-in user
- Update todo name
- Toggle todo completed state
- Delete todos

## Environment Variables

### Backend

Create or update [backend/.env](/abs/c:/Users/Kevin/Desktop/code_projects/todo-app/backend/.env):

```env
MONGO_DB="your_mongodb_connection_string_with_database_name"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN_SECONDS=86400
FRONTEND_URL="http://localhost:3000"
```

Important:

- For MongoDB with Prisma, the connection string must include a database name.
- Example:

```env
MONGO_DB="mongodb+srv://user:password@cluster.mongodb.net/todo_app?retryWrites=true&w=majority"
```

### Frontend

Create or update [frontend/.env.local](/abs/c:/Users/Kevin/Desktop/code_projects/todo-app/frontend/.env.local):

```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
```

## Installation

### Backend

```powershell
cd c:\Users\Kevin\Desktop\code_projects\todo-app\backend
npm install
```

### Frontend

```powershell
cd c:\Users\Kevin\Desktop\code_projects\todo-app\frontend
npm install
```

## Run the Project

Open two terminals.

### Start the backend

```powershell
cd c:\Users\Kevin\Desktop\code_projects\todo-app\backend
npm run start:dev
```

Backend runs on:

```text
http://localhost:8000
```

### Start the frontend

```powershell
cd c:\Users\Kevin\Desktop\code_projects\todo-app\frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## Build Commands

### Backend

```powershell
cd backend
npm run build
```

### Frontend

```powershell
cd frontend
npm run build
```

## Authentication Flow

The frontend uses `axios` and stores the JWT in `localStorage`.

Flow:

1. User registers with `POST /auth/register`
2. User logs in with `POST /auth/login`
3. Backend returns `accessToken`
4. Frontend stores token in `localStorage`
5. `axios` sends `Authorization: Bearer <token>` on protected requests
6. Backend validates the token with `JwtAuthGuard`

## Backend API

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Todos

- `GET /todos`
- `POST /todos`
- `PATCH /todos/:id`
- `DELETE /todos/:id`

## Example Request Bodies

### Register

```json
{
  "name": "Kevin",
  "email": "kevin@example.com",
  "password": "supersecure123"
}
```

### Login

```json
{
  "email": "kevin@example.com",
  "password": "supersecure123"
}
```

### Create Todo

```json
{
  "name": "Finish the todo app"
}
```

### Update Todo

```json
{
  "name": "Finish the todo app today",
  "completed": true
}
```

## Database Notes

The Prisma schema is in [backend/prisma/schema.prisma](/abs/c:/Users/Kevin/Desktop/code_projects/todo-app/backend/prisma/schema.prisma).

Models:

- `User`
- `Todo`

Each todo belongs to one user through `userId`.

## How to Verify It Works

### Check frontend

```powershell
Invoke-WebRequest http://localhost:3000
```

### Check backend

```powershell
Invoke-WebRequest http://localhost:8000/auth/me
```

A `401 Unauthorized` on `/auth/me` without a token is expected and means the backend is running.

## Common Issues

### 1. Prisma MongoDB error: empty database name not allowed

Cause:

- The MongoDB connection string does not include a database name.

Fix:

- Add the database name to `MONGO_DB`, for example `...mongodb.net/todo_app?...`

### 2. Windows error: `EPERM unlink query_engine-windows.dll.node`

Cause:

- Another Node/Nest process is still using Prisma's query engine file.

Fix:

```powershell
Get-NetTCPConnection -LocalPort 8000 -State Listen
Stop-Process -Id <PID> -Force
```

Then restart the backend:

```powershell
npm run start:dev
```

### 3. User does not appear in MongoDB Compass

Check:

- You actually used the register form, not the login form
- You are looking in the `todo_app` database
- You are looking in the `User` collection
- You refreshed Compass or searched by email

Example filter:

```json
{ "email": "user@example.com" }
```

## Notes

- The current frontend still contains some older `app/api/auth/*` route files, but the active auth flow now uses `axios` directly from the client to the backend.
- Todo operations are protected per user, so one user cannot read or mutate another user's todos.

## Related Docs

- [README-NESTJS.md](/abs/c:/Users/Kevin/Desktop/code_projects/todo-app/README-NESTJS.md)
- [README-NEXTJS.md](/abs/c:/Users/Kevin/Desktop/code_projects/todo-app/README-NEXTJS.md)
- [README-PRISMA.md](/abs/c:/Users/Kevin/Desktop/code_projects/todo-app/README-PRISMA.md)
