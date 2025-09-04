import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import app from "./app.js";
import { PORT } from "./constants.js";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ App is running at port ${PORT}`);
      console.log(`🌐 Frontend available at http://localhost:${PORT}`);
      console.log(`🔗 API available at http://localhost:${PORT}/api/v1`);
    });
  })
  .catch((err) => {
    console.error("❌ Error in connecting to DB :", err);
    process.exit(1);
  });
