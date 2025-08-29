const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    for (const item of orderItems) {
  const product = await Product.findById(item.product);

  if (!product) {
    return next(new ErrorHandler(`Product not found: ${item.product}`, 404));
  }

  if (product.Stock < item.quantity) {
    return next(
      new ErrorHandler(
        `Insufficient stock for ${product.name}.`,
        400
      )
    );
  }
}

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    //  // 🔁 Update stock immediately when order is placed
    // for (const item of orderItems) {
    //   await updateStock(item.product, item.quantity);
    // }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("💥 Error while creating order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//Get Single order detail

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  // populate can help  us to get the email and name by going in user database using uder id present in order details
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name  email"
  );

  if (!order) {
    return next(new ErrorHandler(`Order Not Found for these Id.`, 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Logged in User order detail

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  //user:req.use._id to get all the order for logged in user with his id finding in order data base for that id order placed
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(new ErrorHandler(`Orders Not Found for these Id.`, 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

//Get ALL Orders for ADMIN

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Order -- ADMIN
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler(`Orders Not Found for this Id.`, 404));
  }

  // if already delivered, block it
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler(`This order has already been delivered.`, 400));
  }

  // ✅ Decrease stock when order is Shipped
  if (req.body.status === "Shipped") {
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
  }

  // update status
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Order updated to ${req.body.status}`,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.Stock < quantity) {
    throw new Error(`Insufficient stock for product: ${product.name}`);
  }

  product.Stock -= quantity;

  await product.save({
    validateBeforeSave: false,
  });
}

//Delete Order -- ADMIN

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  //user:req.use._id to get all the order for logged in user with his id finding in order data base for that id order placed
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ErrorHandler(`Orders Not Found for these Id.`, 404));
  }

    // 🛠️ Restore stock before deletion
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.Stock += item.quantity;
      await product.save({ validateBeforeSave: false });
    }
  }

  res.status(200).json({
    success: true,
    message: `Order Deleted Successfully`,
  });
});
