const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  getAdminProducts,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/multer.jsx");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/admin/products", isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images"), // ✅ Multer middleware
  createProduct
);

router.put("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"),upload.array("images"), updateProduct);  
router.delete("/admin/product/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router.get("/product/:id", getProductDetails);
router.put("/review", isAuthenticatedUser,createProductReview);
router.get("/reviews",getProductReviews);
router.delete("/reviews", isAuthenticatedUser,authorizeRoles("admin"),deleteReview);



module.exports = router;
