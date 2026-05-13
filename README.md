# PostHub - Full-Stack MERN Application

A production-grade, full-stack content management platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring JWT cookie-based authentication, role-based authorization, and a modern dashboard UI.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS v4** for styling
- **Redux Toolkit** for state management
- **React Router DOM v7** for routing
- **React Hook Form** + **Zod** for form validation
- **Axios** for API communication
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication (HTTP-only cookies)
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Features

- 🔐 JWT authentication with HTTP-only cookies
- 👥 Role-based authorization (Admin / User)
- 📝 Full CRUD for posts
- 🛡️ Protected routes with route guards
- 🎨 Modern glassmorphism UI with dark theme
- 📱 Fully responsive design
- 🔄 Global state management with Redux Toolkit
- ✅ Form validation with Zod
- 🍞 Toast notifications
- 🏗️ Feature-based architecture (frontend & backend)

## Prerequisites

- **Node.js** >= 18.x
- **MongoDB** running locally or a MongoDB Atlas connection string
- **npm** or **yarn**

## Getting Started

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd test-task
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
cp .env.example .env

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

### 4. Default Accounts

The application seeds two default accounts on first run:

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@example.com  | admin123  |
| User  | user@example.com   | user123   |

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
| Method | Endpoint         | Description        | Auth Required |
|--------|------------------|--------------------|---------------|
| POST   | /api/auth/login  | Login user         | No            |
| POST   | /api/auth/logout | Logout user        | No            |
| GET    | /api/auth/me     | Get current user   | Yes           |

### Posts
| Method | Endpoint              | Description         | Auth Required | Role  |
|--------|-----------------------|---------------------|---------------|-------|
| POST   | /api/posts            | Create a post       | Yes           | Any   |
| GET    | /api/posts            | Get all posts       | Yes           | Admin |
| GET    | /api/posts/my-posts   | Get user's posts    | Yes           | Any   |
| PUT    | /api/posts/:id        | Update a post       | Yes           | Any*  |
| DELETE | /api/posts/:id        | Delete a post       | Yes           | Admin |

*Users can only update their own posts. Admins can update any post.

## Project Structure

```
test-task/
├── backend/
│   └── src/
│       ├── config/          # Database configuration
│       ├── features/
│       │   ├── auth/        # Authentication (controller, service, routes, validation)
│       │   ├── users/       # User model and types
│       │   └── posts/       # Posts CRUD (model, controller, service, routes, validation)
│       ├── middlewares/     # Auth, role, error middlewares
│       ├── utils/           # Token generation utilities
│       ├── app.ts           # Express app configuration
│       └── server.ts        # Server entry point
│
├── frontend/
│   └── src/
│       ├── app/             # Redux store and hooks
│       ├── components/
│       │   ├── ui/          # Reusable UI components (Button, Input, Modal, etc.)
│       │   └── common/      # Navbar, Sidebar
│       ├── features/
│       │   ├── auth/        # Auth slice, API, pages, hooks
│       │   └── posts/       # Posts slice, API, pages
│       ├── layouts/         # Dashboard and Auth layouts
│       ├── routes/          # App routes with guards
│       ├── services/        # Axios configuration
│       ├── types/           # Shared TypeScript types
│       ├── App.tsx          # Root component
│       └── main.tsx         # Entry point
│
└── README.md
```

## Scripts

### Backend
```bash
npm run dev     # Start development server with hot reload
npm run build   # Compile TypeScript to JavaScript
npm start       # Run production build
```

### Frontend
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## License

MIT
