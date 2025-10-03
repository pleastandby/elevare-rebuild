# Elevare Application

A full-stack application with React frontend and Node.js backend.

## Project Structure

```
myapp/
├── elevare/          # React frontend
├── backend/          # Node.js backend
├── package.json      # Root package.json for monorepo scripts
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

### Development

1. Start both frontend and backend in development mode:
```bash
npm run dev
```

Or start them separately:

2. Start backend only:
```bash
npm run dev:backend
```

3. Start frontend only:
```bash
npm run dev:frontend
```

### Production

1. Build frontend:
```bash
npm run build:frontend
```

2. Start backend:
```bash
npm run start:backend
```

## Technologies Used

### Frontend (elevare/)
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend (backend/)
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
