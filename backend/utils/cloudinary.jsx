require("dotenv").config({ path: "./config/.env" }); // ⬅ adjust path if needed

const cloudinary = require("cloudinary").v2;

// console.log(process.env);
 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary ENV", {
//   name: process.env.CLOUDINARY_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: process.env.CLOUDINARY_API_SECRET ? true : false,
// });

module.exports = cloudinary;
