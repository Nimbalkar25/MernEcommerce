

//config

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/.env" });
}

const app = require("./app");

// use to get data from frontend to backend database
// import databse file
const connectDB = require("./config/database");

//Handling Uncaught Exception like console.log(youtube);

process.on("uncaughtException",(err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);

    process.exit(1);
})



//Connecting to database by calling function
connectDB();



const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(
    `Shutting down the server due to unhandled Promise rejectionbecause of these no need to use catch in database.js it will done by this`
  );

  server.close(() => {
    process.exit(1);
  });
});
