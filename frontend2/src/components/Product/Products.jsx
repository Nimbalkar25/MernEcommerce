import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";

// Redux hooks to read from and dispatch to the store
import { useSelector, useDispatch } from "react-redux";

// Redux actions
import { clearErrors, getProduct } from "../../actions/productAction";

// Components
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard.jsx";
import MetaData from "../layout/MetaData.jsx";

// Routing hook
import { useParams } from "react-router-dom";

// Third-party UI libraries
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

// Hardcoded list of categories
const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
  "Daily Use",
];

const Products = () => {
  const dispatch = useDispatch();

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1); // Current page in pagination
  const [price, setPrice] = useState([0, 25000]); // Price range
  const [category, setCategory] = useState(""); // Selected category
  const [ratings, setRatings] = useState(0); // Minimum rating filter

  // Destructuring state from Redux store
  const {
    products,
    loading,
    error,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  // Extracting 'keyword' from the URL (e.g., /products/:keyword)
  const { keyword } = useParams();

  // Handle pagination click
  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle price slider change
  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  // Run on filter change or error
  useEffect(() => {
    if (error) {
      alert(error); // You can replace with toast
      dispatch(clearErrors()); // Clear Redux errors
    }

    // Dispatch product fetch with current filters
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, error, price, category, ratings]);

  // If filters reduce total items, but page is beyond limit, reset to page 1
  useEffect(() => {
    const totalPages = Math.ceil(filteredProductsCount / resultPerPage);
    if (currentPage > totalPages && totalPages !== 0) {
      setCurrentPage(1); // Reset to page 1
    }
  }, [filteredProductsCount, currentPage, resultPerPage]);

  // Count of items after filtering (used for pagination)
  let count = filteredProductsCount;

  return (
    <Fragment>
      {/* Show loader while fetching products */}
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS ---- ECOMMERCE" />

          <h2 className="productsHeading">Products</h2>

          {/* Render product cards */}
          <div className="products">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="noProductsFound">No Products Found  !!!</p>
            )}
          </div>

          {/* Filter Sidebar */}
          <div className="filterBox">
            {/* Price Filter */}
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            {/* Category Filter */}
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            {/* Ratings Filter */}
            <fieldset>
              <Typography component="legend">Rating Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => setRatings(newRating)}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {/* Pagination Section */}
          {resultPerPage <= count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={filteredProductsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
