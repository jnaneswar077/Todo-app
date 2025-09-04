# Todo Fullstack Application

A complete fullstack Todo application built with Node.js, Express, MongoDB, and modern frontend technologies.

## 🚀 Features

### Backend
- **User Authentication**: JWT-based authentication with refresh tokens
- **Todo Management**: Full CRUD operations for todos
- **Advanced Features**: Priority levels, status tracking, due dates, tags
- **Search & Filtering**: Search todos by title/description, filter by status/priority
- **Pagination**: Efficient pagination for large todo lists
- **Security**: Password hashing, JWT validation, protected routes

### Frontend
- **Modern UI**: Beautiful, responsive design with glassmorphism effects
- **Real-time Updates**: Instant feedback for all operations
- **Advanced Forms**: Rich input forms with validation
- **Responsive Design**: Works perfectly on all devices
- **Toast Notifications**: User-friendly feedback messages

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **ES Modules** - Modern JavaScript syntax

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icon library
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
todo-fullstack-app/
├── src/
│   ├── index.js                 # Server entry point
│   ├── app.js                   # Express app configuration
│   ├── constants.js             # Application constants
│   ├── db/
│   │   └── index.js            # Database connection
│   ├── routes/
│   │   ├── user.routes.js      # User authentication routes
│   │   └── todo.routes.js      # Todo CRUD routes
│   ├── controllers/
│   │   ├── user.controller.js  # User business logic
│   │   └── todo.controller.js  # Todo business logic
│   ├── models/
│   │   ├── user.model.js       # User schema
│   │   └── todo.model.js       # Todo schema
│   ├── middlewares/
│   │   └── auth.middleware.js  # JWT authentication
│   └── utils/
│       ├── ApiError.js          # Error handling
│       ├── ApiResponse.js       # Response formatting
│       └── asyncHandler.js      # Async wrapper
├── public/
│   ├── index.html              # Main HTML file
│   ├── styles.css              # CSS styles
│   └── script.js               # Frontend JavaScript
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-fullstack-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=todo_app
   CORS_ORIGIN=http://localhost:3000
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
   REFRESH_TOKEN_EXPIRY=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGO_URI in .env file
   ```

5. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:8000
   - API: http://localhost:8000/api/v1

## 📚 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout (protected)
- `GET /api/v1/users/me` - Get current user (protected)

### Todos
- `GET /api/v1/todos` - Get user todos with pagination and filters
- `POST /api/v1/todos` - Create new todo (protected)
- `GET /api/v1/todos/:id` - Get specific todo (protected)
- `PUT /api/v1/todos/:id` - Update todo (protected)
- `DELETE /api/v1/todos/:id` - Delete todo (protected)
- `PATCH /api/v1/todos/:id/status` - Update todo status (protected)
- `PATCH /api/v1/todos/:id/complete` - Mark todo as completed (protected)

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, in_progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `search` - Search in title and description

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Get access and refresh tokens
2. **Protected Routes**: Include `Authorization: Bearer <token>` header
3. **Token Refresh**: Automatic token refresh mechanism
4. **Security**: HTTP-only cookies for token storage

## 🎨 Frontend Features

### User Interface
- **Glassmorphism Design**: Modern, translucent UI elements
- **Responsive Layout**: Adapts to all screen sizes
- **Interactive Elements**: Hover effects, animations, transitions
- **Color-coded Priority**: Visual priority indicators
- **Status Badges**: Clear status representation

### User Experience
- **Form Validation**: Real-time input validation
- **Loading States**: Visual feedback during operations
- **Toast Notifications**: Success, error, and info messages
- **Search & Filters**: Advanced todo filtering
- **Pagination**: Smooth navigation through todos

## 🚀 Development

### Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (if configured)
```

### Code Style
- **ES Modules**: Modern import/export syntax
- **Async/Await**: Promise-based asynchronous operations
- **Error Handling**: Centralized error management
- **Middleware Pattern**: Clean request processing
- **MVC Architecture**: Separation of concerns

## 🔧 Configuration

### Database
- **MongoDB**: NoSQL database with Mongoose ODM
- **Connection**: Configurable via environment variables
- **Indexes**: Optimized for performance
- **Validation**: Schema-based data validation

### Security
- **CORS**: Configurable cross-origin settings
- **Rate Limiting**: Built-in request throttling
- **Input Validation**: Request body validation
- **Password Security**: bcrypt hashing

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify MongoDB connection
3. Check environment variables
4. Review API endpoint documentation
5. Open an issue on GitHub

## 🎯 Future Enhancements

- [ ] Edit todo functionality
- [ ] Todo categories/folders
- [ ] File attachments
- [ ] Collaborative todos
- [ ] Email notifications
- [ ] Dark mode theme
- [ ] Offline support
- [ ] Progressive Web App (PWA)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by professional backend architecture patterns
- Designed for learning and production use
- Follows industry best practices

---

**Happy Coding! 🚀**
