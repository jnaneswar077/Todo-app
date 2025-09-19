# 📝 Todo Fullstack Application

<div align="center">

![Todo App](https://img.shields.io/badge/Todo-App-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*A professional-grade fullstack Todo application with modern architecture, beautiful UI, and comprehensive features*

</div>

## 🌟 Overview

This is a complete fullstack Todo application built with modern web technologies, featuring a robust backend API, elegant frontend interface, and professional-grade architecture. The application demonstrates best practices in web development, including secure authentication, efficient data management, and responsive design.

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with access and refresh tokens
- **Secure Password Hashing** using bcrypt
- **Protected Routes** with middleware validation
- **HTTP-only Cookies** for token storage
- **CORS Configuration** for cross-origin requests

### 📋 Todo Management
- **Complete CRUD Operations** (Create, Read, Update, Delete)
- **Priority Levels** (Low, Medium, High) with visual indicators
- **Status Tracking** (Pending, In Progress, Completed)
- **Due Date Management** with calendar picker
- **Tag System** for better organization
- **Real-time Edit Functionality** with inline form

### 🔍 Advanced Features
- **Smart Search** across title and description
- **Multi-filter System** (status, priority, search)
- **Case-insensitive Filtering** for better UX
- **Pagination** for large todo lists
- **Responsive Design** for all devices
- **Toast Notifications** for user feedback

### 🎨 User Interface
- **Modern Glassmorphism Design** with backdrop blur effects
- **Gradient Backgrounds** and smooth animations
- **Interactive Elements** with hover effects
- **Color-coded Priority System** for quick identification
- **Status Badges** with clear visual representation
- **Toggle Forms** for better space utilization

## 🛠️ Technology Stack

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v16+ | JavaScript runtime environment |
| **Express.js** | ^5.1.0 | Fast, unopinionated web framework |
| **MongoDB** | Latest | NoSQL database for data persistence |
| **Mongoose** | ^8.18.0 | MongoDB object modeling for Node.js |
| **JWT** | ^9.0.2 | Secure authentication tokens |
| **bcrypt** | ^6.0.0 | Password hashing and encryption |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | ^17.2.1 | Environment variable management |
| **cookie-parser** | ^1.4.7 | HTTP cookie parsing middleware |

### Frontend Technologies
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup with modern standards |
| **CSS3** | Advanced styling with Grid, Flexbox, and animations |
| **Vanilla JavaScript** | Pure JavaScript without framework dependencies |
| **Font Awesome** | Professional icon library |
| **Glassmorphism** | Modern UI design trend |
| **Responsive Design** | Mobile-first, cross-device compatibility |

### Development Tools
- **Nodemon** ^3.1.10 - Development server with auto-restart
- **Prettier** ^3.6.2 - Code formatting
- **ES Modules** - Modern import/export syntax

## 📁 Project Architecture

```
📦 todo-fullstack-app/
├── 📁 src/                      # Backend source code
│   ├── 📄 index.js              # Server entry point & startup
│   ├── 📄 app.js                # Express app configuration
│   ├── 📄 constants.js          # Application constants
│   │
│   ├── 📁 db/                   # Database layer
│   │   └── 📄 index.js          # MongoDB connection setup
│   │
│   ├── 📁 routes/               # API route definitions
│   │   ├── 📄 user.routes.js    # Authentication endpoints
│   │   └── 📄 todo.routes.js    # Todo CRUD endpoints
│   │
│   ├── 📁 controllers/          # Business logic layer
│   │   ├── 📄 user.controller.js # User operations (auth, profile)
│   │   └── 📄 todo.controller.js # Todo operations (CRUD, filters)
│   │
│   ├── 📁 models/               # Data models & schemas
│   │   ├── 📄 user.model.js     # User schema with auth methods
│   │   └── 📄 todo.model.js     # Todo schema with validations
│   │
│   ├── 📁 middlewares/          # Request processing
│   │   └── 📄 auth.middleware.js # JWT token validation
│   │
│   └── 📁 utils/                # Helper utilities
│       ├── 📄 ApiError.js       # Custom error handling
│       ├── 📄 ApiResponse.js    # Standardized API responses
│       └── 📄 asyncHandler.js   # Async/await error wrapper
│
├── 📁 public/                   # Frontend static files
│   ├── 📄 index.html            # Main HTML structure
│   ├── 📄 styles.css            # Complete CSS styling
│   └── 📄 script.js             # Frontend JavaScript logic
│
├── 📄 package.json              # Project dependencies & scripts
├── 📄 .env                      # Environment variables (not in repo)
├── 📄 .gitignore               # Git ignore rules
└── 📄 README.md                # This documentation
```

### 🏗️ Architecture Patterns

- **MVC Pattern**: Model-View-Controller separation
- **Middleware Pattern**: Request/response processing pipeline
- **Repository Pattern**: Data access abstraction
- **Error-First Callbacks**: Consistent error handling
- **RESTful API Design**: Standard HTTP methods and status codes

## 🚀 Quick Start Guide

### 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud) - [MongoDB Atlas](https://www.mongodb.com/atlas) or [Local Installation](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn** package manager
- **Git** for version control

### ⚡ Installation Steps

1. **📥 Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd todo-fullstack-app
   ```

2. **📦 Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **⚙️ Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=todo_app
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:8000
   
   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
   REFRESH_TOKEN_EXPIRY=7d
   ```

   > **🔐 Security Note**: Replace the JWT secrets with strong, unique values in production!

4. **🗄️ Database Setup**
   
   **Option A: Local MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```
   
   **Option B: MongoDB Atlas (Cloud)**
   ```bash
   # Update MONGO_URI in .env file with your Atlas connection string
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_app
   ```

5. **🚀 Start the Application**
   
   **Development Mode** (with auto-restart):
   ```bash
   npm run dev
   ```
   
   **Production Mode**:
   ```bash
   npm start
   ```

6. **🌐 Access the Application**
   
   - **Frontend**: http://localhost:8000
   - **API Base**: http://localhost:8000/api/v1
   - **Health Check**: http://localhost:8000/api/v1/health

### 🎯 First Time Setup

1. **Register a New Account**
   - Navigate to http://localhost:8000
   - Click "Register here" 
   - Fill in your details and create an account

2. **Start Creating Todos**
   - Click "Add New Todo" button
   - Fill in the todo details
   - Use filters and search to organize your todos

## 📚 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/users/register` | Register new user | ❌ |
| `POST` | `/api/v1/users/login` | User login | ❌ |
| `POST` | `/api/v1/users/logout` | User logout | ✅ |
| `GET` | `/api/v1/users/me` | Get current user profile | ✅ |

### 📋 Todo Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/todos` | Get user todos (with filters) | ✅ |
| `POST` | `/api/v1/todos` | Create new todo | ✅ |
| `GET` | `/api/v1/todos/:id` | Get specific todo | ✅ |
| `PUT` | `/api/v1/todos/:id` | Update entire todo | ✅ |
| `DELETE` | `/api/v1/todos/:id` | Delete todo | ✅ |
| `PATCH` | `/api/v1/todos/:id/status` | Update only status | ✅ |
| `PATCH` | `/api/v1/todos/:id/complete` | Mark as completed | ✅ |

### 🔍 Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Items per page (max: 50) |
| `status` | string | - | Filter by status: `pending`, `in_progress`, `completed` |
| `priority` | string | - | Filter by priority: `low`, `medium`, `high` |
| `search` | string | - | Search in title and description (case-insensitive) |

### 📝 Request/Response Examples

**Create Todo:**
```json
POST /api/v1/todos
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "priority": "high",
  "dueDate": "2024-12-31",
  "tags": ["work", "documentation", "urgent"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "priority": "high",
    "status": "pending",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "tags": ["work", "documentation", "urgent"],
    "user": "64f8a1b2c3d4e5f6g7h8i9j0",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🔐 Authentication System

### JWT Token Flow
```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database
    
    Client->>Server: POST /register (username, email, password)
    Server->>Database: Create user with hashed password
    Database-->>Server: User created
    Server-->>Client: Success response
    
    Client->>Server: POST /login (email, password)
    Server->>Database: Verify credentials
    Database-->>Server: User data
    Server-->>Client: Access & Refresh tokens
    
    Client->>Server: Protected route with Bearer token
    Server->>Server: Verify JWT token
    Server-->>Client: Protected resource
```

### Security Features
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure access and refresh token system
- **Protected Routes**: Middleware-based authentication
- **Token Expiry**: Configurable token lifetimes
- **CORS Protection**: Cross-origin request handling

## 🎨 Frontend Architecture

### Key Features
- **🎭 Glassmorphism UI**: Modern translucent design with backdrop blur
- **📱 Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **🔄 Real-time Updates**: Instant feedback for all operations
- **🎯 Smart Filtering**: Case-insensitive search and filtering
- **✨ Interactive Elements**: Smooth animations and hover effects
- **📊 Visual Indicators**: Color-coded priorities and status badges
- **🔔 Toast Notifications**: User-friendly success/error messages

### User Experience Flow
1. **Authentication**: Seamless login/register with form validation
2. **Dashboard**: Clean overview of all todos with quick actions
3. **Todo Management**: Toggle forms for adding/editing todos
4. **Filtering**: Advanced search and filter combinations
5. **Real-time Feedback**: Loading states and success confirmations

## 🛠️ Development Workflow

### Available Scripts
```bash
# Development
npm run dev          # Start with nodemon (auto-restart)
npm start           # Production server
npm test            # Run test suite (when configured)

# Code Quality
npx prettier --write .    # Format code
npm audit                 # Security audit
npm outdated             # Check for updates
```

### Code Architecture
- **🏗️ MVC Pattern**: Clean separation of concerns
- **⚡ ES Modules**: Modern JavaScript import/export
- **🔄 Async/Await**: Promise-based operations
- **🛡️ Error Handling**: Centralized error management
- **🔧 Middleware**: Request/response processing pipeline

## 🔧 Configuration & Deployment

### Environment Variables
```env
# Required Configuration
PORT=8000                    # Server port
NODE_ENV=production         # Environment mode
MONGO_URI=mongodb://...     # Database connection
DB_NAME=todo_app           # Database name

# Security Configuration
ACCESS_TOKEN_SECRET=xxx     # JWT access token secret
REFRESH_TOKEN_SECRET=xxx    # JWT refresh token secret
CORS_ORIGIN=https://...     # Allowed origins

# Optional Configuration
ACCESS_TOKEN_EXPIRY=15m     # Token expiry time
REFRESH_TOKEN_EXPIRY=7d     # Refresh token expiry
```

### Production Deployment
1. **Environment Setup**: Configure production environment variables
2. **Database**: Use MongoDB Atlas or dedicated MongoDB instance
3. **Security**: Use strong JWT secrets and HTTPS
4. **Monitoring**: Implement logging and error tracking
5. **Performance**: Enable compression and caching

## 🚀 Performance & Scalability

### Backend Optimizations
- **Database Indexing**: Optimized queries for user and todo operations
- **Pagination**: Efficient data loading with configurable limits
- **Middleware Caching**: Request optimization and response caching
- **Error Handling**: Graceful error responses and logging

### Frontend Optimizations
- **Vanilla JavaScript**: No framework overhead
- **CSS Optimization**: Efficient styling with modern CSS features
- **Image Optimization**: Optimized assets and lazy loading
- **Network Requests**: Debounced search and efficient API calls

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile Safari | 14+ | ✅ Fully Supported |
| Chrome Mobile | 90+ | ✅ Fully Supported |

## 🤝 Contributing Guidelines

### Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Ensure no console errors or warnings

## 🎯 Roadmap & Future Enhancements

### ✅ Completed Features
- [x] User authentication with JWT
- [x] Complete CRUD operations for todos
- [x] Advanced filtering and search
- [x] Real-time edit functionality
- [x] Responsive glassmorphism UI
- [x] Case-insensitive filtering
- [x] **Dark Mode Theme**: Toggle between light and dark themes with localStorage persistence

### 🚧 Planned Features
- [ ] **Todo Categories**: Organize todos into custom categories
- [ ] **File Attachments**: Add files and images to todos
- [ ] **Collaborative Todos**: Share todos with other users
- [ ] **Email Notifications**: Reminders for due dates
- [ ] **Offline Support**: PWA with offline functionality
- [ ] **Mobile App**: React Native mobile application
- [ ] **API Rate Limiting**: Enhanced security features

## 📄 License & Legal

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Third-party Licenses
- **Font Awesome**: Icons under Font Awesome Free License
- **Node.js Packages**: Various MIT and ISC licenses

## 🆘 Troubleshooting

### Common Issues

**🔴 MongoDB Connection Error**
```bash
# Check MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

**🔴 Port Already in Use**
```bash
# Find and kill process using port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows
```

**🔴 JWT Token Issues**
- Verify JWT secrets in `.env` file
- Check token expiry settings
- Clear browser cookies and localStorage

### Getting Help
- 📖 Check this documentation
- 🐛 Open an issue on GitHub
- 💬 Join our community discussions
- 📧 Contact the maintainers

## 🙏 Acknowledgments

### Built With ❤️ Using
- **Node.js & Express.js** - Robust backend framework
- **MongoDB & Mongoose** - Flexible database solution
- **JWT** - Secure authentication standard
- **Modern CSS** - Beautiful, responsive design
- **Vanilla JavaScript** - Pure, performant frontend

### Inspiration
- Modern web development best practices
- Professional backend architecture patterns
- User-centered design principles
- Open source community contributions

---

<div align="center">

### 🚀 **Ready to build amazing todos?**

**[⭐ Star this repo](https://github.com/your-username/todo-fullstack-app)** • **[🍴 Fork it](https://github.com/your-username/todo-fullstack-app/fork)** • **[📝 Contribute](CONTRIBUTING.md)**

**Happy Coding! 🎉**

</div>
