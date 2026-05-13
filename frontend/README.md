# PostHub Frontend

A modern, responsive, and highly interactive frontend dashboard for the PostHub platform.

## Tech Stack

- **Library**: React 19
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit (with `createAsyncThunk`)
- **Routing**: React Router DOM v7
- **Form Handling**: React Hook Form
- **Validation**: Zod schema validation
- **HTTP Client**: Axios (with centralized interceptors)
- **Notifications**: React Hot Toast

## Features

- 🎨 **Premium UI/UX**: Built with a sleek, glassmorphism dark theme using custom Tailwind configurations.
- 🛡️ **Route Guards**: Secure `ProtectedRoute` and `AdminRoute` wrappers that restrict page access based on auth and roles.
- 📊 **Dashboards**: Separate dashboards for normal users (My Posts) and administrators (Admin Dashboard, Manage Posts).
- 🔄 **Centralized API**: Uses Axios interceptors to seamlessly handle API requests and 401/403 error redirects.
- 📱 **Responsive**: Fully responsive interface that works flawlessly on desktop, tablet, and mobile.

## Setup Instructions

Follow these steps to run the frontend locally:

### 1. Prerequisites
- **Node.js**: v18.x or higher
- Make sure the backend server is running on `http://localhost:5000` (so API requests can resolve).

### 2. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Variables
The `.env` file is already provided and tracked for your convenience. However, if you need to recreate it, copy from the example:
```bash
cp .env.example .env
```
Ensure your `.env` contains the API base URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application
Start the development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`. 

Use one of the auto-seeded demo accounts to log in:
- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production to the `dist/` folder.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint to check code quality.
