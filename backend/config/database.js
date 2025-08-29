const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((data) => {
      console.log(`📌 MongoDB Connected: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
      process.exit(1); // Exit on error
    });
};

module.exports = connectDB;
