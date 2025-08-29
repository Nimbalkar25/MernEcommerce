const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Product Name.."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter Product description.."],
  },
  price: {
    type: Number,
    required: [true, "Please enter Product price.."],
    maxLength: [8, "Price cannot exceeds 8 digits"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    // created array of images instead of object multiple images will be there
    {
      //When you upload an image to Cloudinary,
      // it responds with a JSON object containing public_id and url
      // when we upload image in cloud we get public id and url so we are taking that

      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter Product category"],
  },
  Stock: {
    type: Number,
    required: [4, "Stock cannot exceeds more then 4"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
