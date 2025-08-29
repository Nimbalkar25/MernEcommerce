import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import { clearErrors } from "../../actions/productAction";

// Component to render each product card
import ProductCard from "./ProductCard.jsx";

// Component to set <title> of the page dynamically
import MetaData from "../layout/MetaData.jsx";

// React-Redux hooks
import { useSelector, useDispatch } from "react-redux";

// Action creator to fetch product list from backend
import { getProduct } from "../../actions/productAction.jsx";

// Loader component to show spinner during loading
import Loader from "../layout/Loader/Loader.jsx";

// Alert hook to show error messages
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();       // For showing error alerts
  const dispatch = useDispatch(); // Used to call Redux actions

  // Getting product state from Redux store
  const { loading, error, products } = useSelector(
    (state) => state.products
  );

  // Fetch products on component mount
  useEffect(() => {
      if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    // Call Redux action to get all products from backend
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  // JSX to render UI
  return (
    <Fragment>
      {
        loading ? (
          // Show spinner while loading
          <Loader />
        ) : (
          <Fragment>
            {/* Set page <title> */}
            <MetaData title="ECOMMERCE" />

            {/* Banner Section */}
            <div className="banner">
              <p>Welcome to Ecommerce</p>
              <h1>FIND AMAZING PRODUCTS BELOW</h1>
              <a href="#container">
                <button>
                  Scroll <CgMouse />
                </button>
              </a>
            </div>

            {/* Product List Heading */}
            <h2 className="homeHeading">Featured Products</h2>

            {/* Products Container */}
            <div className="container" id="container">
              {/* Loop through products and show ProductCard for each */}
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          </Fragment>
        )
      }
    </Fragment>
  );
};

export default Home;
