import React from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";


// This component renders a single product card.
// It receives the `product` data as a prop from the parent (usually a product list).

const Product = ({ product }) => {
  

  // ReactStars options for displaying the star rating
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    // Entire product card is wrapped in a Link, so clicking it goes to the product detail page
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} /> 
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default Product;
