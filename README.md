# BlogApp - Full-Stack MERN Blog Application

A full-stack blog platform built with MongoDB, Express.js, React 19, Node.js, and Tailwind CSS. The application features role-based access control (User and Admin), content management with draft and publication workflows, category filtering, search, comment moderation, user profiles with image uploads, and comprehensive automated test suites for both frontend and backend.

---

## 🚀 Live Demo

- **Live Application**: [https://blog-application-eight-ochre.vercel.app/](https://blog-application-eight-ochre.vercel.app/)

### 👤 Standard User Access

New visitors can create their own standard user account through the application's registration page.

### 🛡️ Demo Admin Access
To explore the administrative features (dashboard metrics, post moderation, category management, comment approvals), you can log in using the following credentials:
- **Email:** `demo.admin@blogapp.com`
- **Password:** `demoAdmin123!`

*(Note: This account is provided for recruiters and visitors to explore the application's admin functionality.)*

---

## Key Features

- **Role-Based Access Control**: Secure authentication and authorization with JSON Web Tokens (JWT) and bcrypt password hashing, distinguishing between standard users and administrators.
- **Post Management & Publishing Workflow**: Users can create draft posts; administrators can review, publish, edit, and delete any post.
- **Search, Filter & Pagination**: Server-side pagination, keyword search across title and content, and category-based post filtering.
- **Interactive Comment System**: Authenticated users can comment on posts, with an administrative approval pipeline before comments appear publicly.
- **User Profile & Media Uploads**: Profile management with avatar image upload, replacement, and removal utilizing Cloudinary for persistent storage.
- **Admin Dashboard**: Dedicated administrative interface with platform metrics (posts, categories, comments, pending approvals) and moderation controls.
- **Automated Testing**: 177 tests across backend and frontend.

---

## Tech Stack

### Frontend
- **Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **HTTP Client**: Axios
- **Token Decoding**: `jwt-decode`
- **Testing**: Jest, React Testing Library, Babel
- **Deployment**: Vercel

### Backend
- **Runtime & Framework**: Node.js (ES Modules), Express.js 5
- **Database & ODM**: MongoDB Atlas, Mongoose 9
- **Authentication**: `jsonwebtoken` (JWT), `bcryptjs`
- **File Storage**: Cloudinary (via Multer)
- **CORS**: `cors` middleware
- **Testing**: Jest, `supertest`, `mongodb-memory-server`
- **Deployment**: Render

---

## Application Architecture

The project is structured as a decoupled client-server architecture deployed on modern cloud infrastructure:

```text
┌─────────────────────────────────────────────────────────┐
│                    React 19 Frontend                    │
│   (Vite, Tailwind CSS v4, React Router 7, Axios)        │
│                [Deployed on Vercel]                     │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / JSON (REST API)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Express 5 Backend                     │
│   (Auth & Role Middleware, Controllers, Multer)         │
│                [Deployed on Render]                     │
└──────────────┬─────────────────────────────┬────────────┘
               │ Mongoose ODM                │ API Integration
               ▼                             ▼
┌────────────────────────────┐ ┌──────────────────────────┐
│      MongoDB Atlas         │ │       Cloudinary         │
│ (Users, Posts, Categories) │ │ (Images & Media Storage) │
└────────────────────────────┘ └──────────────────────────┘
```

---

## Main User Features

- **Authentication**: Register with name, email, and password; login with credential verification and JWT generation.
- **Browsing & Discovery**: Browse published blog posts with pagination, search by title/content, and filter by category.
- **Post Reading**: View full post details with author information, timestamps, featured images, and approved comments.
- **Draft Creation**: Submit posts which default to draft status awaiting administrator review.
- **Commenting**: Submit comments on published posts (held in pending state until approved).
- **Profile Management**: View personal details, total post count, and upload, update, or remove a profile picture.

---

## Admin Features

- **Admin Dashboard**: Overview metrics showing total posts, published posts, draft posts, total categories, total comments, and pending comment count.
- **Post Moderation**: View all posts (including drafts), edit titles/content/categories, toggle publish status, and delete posts.
- **Category Management**: Create new categories, rename existing categories, and delete unused categories.
- **Comment Moderation**: Review all user comments, approve pending comments for public display, or delete comments.
- **Direct Publishing**: Posts created by administrators can be published immediately.

---

## Testing

The codebase includes comprehensive unit and integration test suites:

- **Backend**: **114 tests passed** across **14 test suites** (covering models, controllers, auth middleware, admin middleware, and upload middleware using `mongodb-memory-server` and `supertest`).
- **Frontend**: **63 tests passed** across **12 test suites** (covering navigation, route guards, pages, modal components, and API integration layers using React Testing Library).
- **Total**: **177 passed tests**.

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## Local Setup

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (Node Package Manager)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection URI)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables (see [Environment Variables](#environment-variables) section below).

5. Start the backend server:
   ```bash
   # Development mode (with file watcher)
   npm run dev

   # Production mode
   npm start
   ```

   The backend will run on `http://localhost:5000` by default.

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables if running on a custom port.

5. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:5173`.

6. To build the frontend for production:
   ```bash
   npm run build
   ```

---

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and update the values:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port on which the Express server listens | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/mern_blog` |
| `JWT_SECRET` | Secret key used for signing and verifying JWTs | *Your strong secret string* |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` and update if necessary:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000` |

---

## Project Structure

```
BlogApp/
├── .gitignore                      # Root Git ignore rules
├── README.md                       # Project documentation
├── backend/
│   ├── .env.example                # Backend environment variable template
│   ├── .gitignore                  # Backend Git ignore rules
│   ├── jest.config.js              # Jest configuration for backend
│   ├── package.json                # Backend dependencies and scripts
│   ├── server.js                   # Server bootstrap and database connection
│   ├── uploads/                    # Local storage for uploaded files (.gitkeep tracked)
│   └── src/
│       ├── app.js                  # Express application setup and route mounting
│       ├── config/
│       │   └── db.js               # MongoDB connection handler
│       ├── controllers/
│       │   ├── admin.controller.js
│       │   ├── auth.controller.js
│       │   ├── category.controller.js
│       │   ├── comment.controller.js
│       │   ├── post.controller.js
│       │   └── user.controller.js
│       ├── middleware/
│       │   ├── admin.middleware.js # Admin role verification
│       │   ├── auth.middleware.js  # JWT extraction and validation
│       │   └── upload.middleware.js# Multer file upload configuration
│       ├── models/
│       │   ├── Category.model.js
│       │   ├── Comment.model.js
│       │   ├── Post.model.js
│       │   └── User.model.js
│       ├── routes/
│       │   ├── admin.routes.js
│       │   ├── auth.routes.js
│       │   ├── category.routes.js
│       │   ├── comment.routes.js
│       │   ├── post.routes.js
│       │   ├── test.routes.js
│       │   └── user.routes.js
│       └── __tests__/              # Backend test suites (14 suites, 114 tests)
│
└── frontend/
    ├── .env.example                # Frontend environment variable template
    ├── .gitignore                  # Frontend Git ignore rules
    ├── index.html                  # HTML entry point
    ├── package.json                # Frontend dependencies and scripts
    ├── vite.config.js              # Vite build and plugin configuration
    ├── public/                     # Static assets
    └── src/
        ├── App.jsx                 # Client-side route declarations
        ├── index.css               # Tailwind CSS entry
        ├── main.jsx                # React root rendering
        ├── setupTests.js           # Jest DOM matchers configuration
        ├── api/                    # Axios API client modules
        │   ├── adminCategoryApi.js
        │   ├── adminCommentApi.js
        │   ├── adminDashboardApi.js
        │   ├── adminPostApi.js
        │   ├── authApi.js
        │   ├── axios.js
        │   ├── commentApi.js
        │   └── userApi.js
        ├── components/
        │   ├── AdminRoute.jsx      # Admin route guard
        │   ├── LoginModal.jsx      # Reusable login modal
        │   ├── Navbar.jsx          # Header navigation
        │   └── ProtectedRoute.jsx  # Authenticated route guard
        ├── pages/
        │   ├── CreatePost.jsx      # User post creation
        │   ├── Home.jsx            # Post feed with search & filtering
        │   ├── Login.jsx           # User login page
        │   ├── PostDetail.jsx      # Post reader and comment section
        │   ├── Profile.jsx         # User profile and avatar management
        │   ├── Register.jsx        # User registration page
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── AdminLayout.jsx
        │       ├── CreatePost.jsx
        │       ├── ManageCategories.jsx
        │       ├── ManageComments.jsx
        │       └── ManagePosts.jsx
        ├── utils/
        │   └── auth.js             # Token decoding and auth state helper
        └── __tests__/              # Frontend test suites (12 suites, 63 tests)
```

---

## Deployment Architecture

The application is fully deployed and available for live demonstration.
- **Frontend**: Hosted on **Vercel** with client-side routing configured via `vercel.json` rewrite rules.
- **Backend**: Hosted on **Render** utilizing environment-based CORS configuration (`CLIENT_URL`) to securely communicate with the frontend.
- **Database**: Hosted on **MongoDB Atlas** for secure, highly available data persistence.
- **Media Storage**: Uploaded profile and post images are managed through **Cloudinary**, ensuring uploaded images persist independently of the backend server and providing optimized media delivery.

---

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
