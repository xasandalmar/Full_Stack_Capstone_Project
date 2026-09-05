import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("");
      console.log(
        `Finance Tracker API Server running on http://localhost:${PORT}`
      );
      console.log(
        `Swagger Docs: http://localhost:${PORT}/api/docs`
      );
      console.log("");
    });
  })
  .catch((error) => {
    console.error("Server startup error:", error.message || error);
    process.exit(1);
  });