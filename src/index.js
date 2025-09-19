import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import app from "./app.js";
import { PORT as APP_PORT } from "./constants.js";
import { notificationService } from "./services/notificationService.js";

const PORT = process.env.PORT || APP_PORT; // 👈 use platform port first
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ App is running at port ${PORT}`);
      console.log(`🌐 Frontend available at http://localhost:${PORT}`);
      console.log(`🔗 API available at http://localhost:${PORT}/api/v1`);
      
      // Start notification service after a brief delay to ensure env vars are loaded
      if (process.env.NODE_ENV !== 'test') {
        setTimeout(() => {
          notificationService.start();
          console.log(`📧 Email notification service started`);
        }, 500);
      }
    });
  })
  .catch((err) => {
    console.error("❌ Error in connecting to DB :", err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  notificationService.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  notificationService.stop();
  process.exit(0);
});
