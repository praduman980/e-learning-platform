# LearnHub - E-Learning Platform

A comprehensive e-learning platform built with the MERN stack featuring video lectures, quizzes, code compiler, AI doubt solver, certificates, and payment integration.

## 🚀 Features

- **Student & Teacher Login** - Role-based authentication with JWT
- **Video Lectures** - Course content with embedded video player
- **Quiz System** - Interactive quizzes with auto-grading and detailed results
- **Code Compiler** - Run code in 20+ programming languages (Piston API)
- **AI Doubt Solver** - AI-powered learning assistant (OpenAI API)
- **Certificates** - Auto-generated PDF certificates on course completion
- **Payment Integration** - Secure payments via Stripe
- **Dashboards** - Dedicated dashboards for students and teachers

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit
- React Router v6
- Stripe Elements
- React Player

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (media storage)
- Stripe API
- OpenAI API
- Piston API (code execution)
- PDFKit (certificates)

## 📁 Project Structure

```
e-learning-platform/
├── backend/           # Express API server
│   ├── config/        # Database & service configs
│   ├── controllers/   # Route handlers
│   ├── middleware/     # Auth, error handling
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   └── utils/         # Helper functions
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # State management
│   │   └── api/         # Axios configuration
│   └── ...
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Stripe account
- OpenAI API key
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd e-learning-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment**
Edit `backend/.env` with your credentials:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:5173
```

4. **Frontend Setup**
```bash
cd frontend
npm install
```

5. **Run the Application**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

6. **Open in Browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (teacher)
- `PUT /api/courses/:id` - Update course (teacher)
- `DELETE /api/courses/:id` - Delete course (teacher)
- `POST /api/courses/:id/enroll` - Enroll in course

### Lectures
- `GET /api/courses/:courseId/lectures` - Get course lectures
- `POST /api/courses/:courseId/lectures` - Create lecture
- `PUT /api/lectures/:id` - Update lecture
- `DELETE /api/lectures/:id` - Delete lecture

### Quiz
- `GET /api/courses/:courseId/quiz` - Get quiz
- `POST /api/courses/:courseId/quiz` - Create quiz (teacher)
- `POST /api/quiz/:id/submit` - Submit quiz answers

### Payment
- `POST /api/payment/create-intent` - Create Stripe payment
- `POST /api/payment/confirm` - Confirm payment
- `GET /api/payment/history` - Payment history

### Certificate
- `POST /api/certificate/generate` - Generate certificate
- `GET /api/certificate/my` - Get my certificates
- `GET /api/certificate/verify/:id` - Verify certificate

### Compiler
- `GET /api/compiler/languages` - Get supported languages
- `POST /api/compiler/execute` - Execute code

### AI Assistant
- `POST /api/ai/ask` - Ask AI doubt solver

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

This project is licensed under the MIT License.

