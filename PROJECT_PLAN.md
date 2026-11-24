# E-Learning Platform - Complete Project Plan

## Tech Stack
- **Frontend**: React.js (Vite) + Tailwind CSS + Redux Toolkit
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe
- **Video**: Cloudinary (for video hosting/streaming)
- **Code Compiler**: Piston API (multi-language code execution)
- **AI Doubt Solver**: OpenAI API (ChatGPT)
- **Certificates**: PDFKit (PDF generation)

## Project Structure

```
e-learning-platform/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── stripe.js
│   │   └── cloudinary.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lecture.js
│   │   ├── Quiz.js
│   │   ├── Certificate.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── lectureRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── certificateRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── compilerRoutes.js
│   │   └── aiRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lectureController.js
│   │   ├── quizController.js
│   │   ├── certificateController.js
│   │   ├── paymentController.js
│   │   ├── compilerController.js
│   │   └── aiController.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── certificateTemplate.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Course/
│   │   │   │   ├── CourseCard.jsx
│   │   │   │   ├── CourseList.jsx
│   │   │   │   └── CourseDetail.jsx
│   │   │   ├── Lecture/
│   │   │   │   ├── VideoPlayer.jsx
│   │   │   │   └── LectureList.jsx
│   │   │   ├── Quiz/
│   │   │   │   ├── QuizComponent.jsx
│   │   │   │   └── QuizResult.jsx
│   │   │   ├── Compiler/
│   │   │   │   └── CodeCompiler.jsx
│   │   │   ├── AI/
│   │   │   │   └── AIDoubtSolver.jsx
│   │   │   ├── Certificate/
│   │   │   │   └── CertificateView.jsx
│   │   │   └── Dashboard/
│   │   │       ├── StudentDashboard.jsx
│   │   │       └── TeacherDashboard.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── courseSlice.js
│   │   │   └── quizSlice.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseView.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CompilerPage.jsx
│   │   │   ├── AIPage.jsx
│   │   │   └── CertificatePage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── TODO.md
└── README.md
```

## Implementation Steps

### Phase 1: Backend Foundation
1. Initialize backend with Express, MongoDB connection
2. Create User model with student/teacher roles
3. Implement JWT authentication & authorization
4. Create Course, Lecture, Quiz models

### Phase 2: Backend Features
5. Course CRUD operations (teachers create, students enroll)
6. Lecture management with video upload
7. Quiz system with scoring
8. Payment integration with Stripe
9. Certificate generation (PDF)
10. Code compiler integration (Piston API)
11. AI doubt solver (OpenAI API)

### Phase 3: Frontend Foundation
12. Initialize React + Vite + Tailwind
13. Setup Redux store and auth slice
14. Create login/register pages
15. Create navbar, footer, sidebar components

### Phase 4: Frontend Features
16. Course listing and detail pages
17. Video player and lecture components
18. Quiz interface
19. Code compiler UI
20. AI doubt solver chat
21. Certificate viewer/download
22. Student & Teacher dashboards
23. Payment checkout page

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

### Courses
- GET /api/courses
- GET /api/courses/:id
- POST /api/courses (teacher)
- PUT /api/courses/:id (teacher)
- DELETE /api/courses/:id (teacher)
- POST /api/courses/:id/enroll (student)

### Lectures
- GET /api/courses/:courseId/lectures
- POST /api/courses/:courseId/lectures (teacher)
- PUT /api/lectures/:id (teacher)
- DELETE /api/lectures/:id (teacher)

### Quiz
- GET /api/courses/:courseId/quiz
- POST /api/courses/:courseId/quiz (teacher)
- POST /api/quiz/:id/submit (student)

### Payment
- POST /api/payment/create-intent
- POST /api/payment/confirm

### Certificate
- GET /api/certificate/:courseId
- POST /api/certificate/generate

### Compiler
- POST /api/compiler/execute

### AI Doubt Solver
- POST /api/ai/ask

