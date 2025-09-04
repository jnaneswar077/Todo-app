import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// Route mounting
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);

// Serve frontend
// Serve frontend (catch-all for non-API routes)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    // Let API routes continue to error handler if not found
    return next();
  }
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  
  res.status(statusCode).json({
    statusCode,
    data: null,
    message,
    success: false,
    errors: err.errors || []
  });
});

export default app;
