import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./.env" });

console.log("🔍 Environment Variables Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Not set");
console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? `✅ Set (${process.env.EMAIL_PASSWORD.length} chars)` : "❌ Not set");
console.log("EMAIL_FROM_NAME:", process.env.EMAIL_FROM_NAME);

console.log("\n🔍 All environment variables:");
Object.keys(process.env).forEach(key => {
    if (key.startsWith('EMAIL_') || key.startsWith('MONGO_') || key === 'PORT' || key === 'NODE_ENV') {
        console.log(`${key}:`, process.env[key]);
    }
});
