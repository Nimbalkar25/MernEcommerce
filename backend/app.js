const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path =  require("path");


//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/.env" });
}
// ✅ Global error handler (after routes)
const errorMiddleware = require("./middleware/error");


// ✅ Middleware: Should be added before routes
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies



// ✅ CORS config: After other parsers
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

// ✅ Routes
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");
const orderRoutes = require("./routes/orderRoutes");
const payment = require("./routes/paymentRoutes");

app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../frontend2/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend2/dist/index.html"));
});

app.use(errorMiddleware);

module.exports = app;
