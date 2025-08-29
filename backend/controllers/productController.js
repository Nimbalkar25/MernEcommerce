const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

// ✅ Import and configure Cloudinary
const cloudinary = require("cloudinary").v2;

//GET ALL PRODUCTS
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // created that react alert is working fine in front end
  // return next(new ErrorHandler ("This is my Temporary Error ",500));

  //product on a page
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  // after making search in apifeaturejs we need to use it and remove Product.find()
  // now with search, filter,pagination method also added of class
  // Step 1: Apply search and filter
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  // Step 2: Clone query BEFORE executing pagination
  // let products = await apiFeature.query.clone(); // used only for count

  let products = await apiFeature.query.clone();
  const filteredProductsCount = products.length;

  // Step 3: Apply pagination on original query
  apiFeature.pagination(resultPerPage);

  // Step 4: Run paginated query (only paginated data now)
  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

//GET Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//CREATE PRODUCT -- ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  // ✅ Handle multiple images
  let images = [];

  if (!req.files || req.files.length === 0) {
    return next(
      new ErrorHandler("Please upload at least one product image", 400)
    );
  }

  // Upload each file to Cloudinary
  for (const file of req.files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    images.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  // Attach images to request body
  req.body.images = images;

  // ✅ Create product in DB
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    product,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//UPDATE PRODUCT --ADMIN

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  let images = [];

  // If new images are uploaded
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary
    for (let img of product.images) {
      if (img.public_id) {
        const deletionResult = await cloudinary.uploader.destroy(img.public_id);
        console.log("Deleted:", deletionResult);
      }
    }

    // Upload new images
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  } else {
    // No new images — keep existing ones
    images = product.images;
  }

  req.body.images = images;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product,
  });
});



//DELETE PRODUCT --ADMIN

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  // const product = await Product.findById(req.params.id);

  // using deleteOne function we have to make product
  // const or let okay but prefer let to modify or delete product
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  //delete from cloudinary

  for (let i = 0; i < product.images.length; i++) {
    if (product.images[i].public_id) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }
  }

  // product = await Product.findByIdAndDelete(req.params.id,
  //   {
  //     new: true,
  //     runValidators: true,
  //     useFindAndModify: false,
  //   }
  //  )
  // instead of this just use this below
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
    product,
  });
});

// Create a New review or update a review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewd = product.reviews.find(
    // rev.user is id present in reviews and
    // req.user._id is the  user id who is logged in and going to comment
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewd) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    message: `Thanks For your Review`,
  });
});

//Get All reviews of a product

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler(`Product Not Found`, 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete Product review

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler(`Product Not Found`, 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = reviews.length === 0 ? 0 : avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: `Product Review deleted`,
  });
});
