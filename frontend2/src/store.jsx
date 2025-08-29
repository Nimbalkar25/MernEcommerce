// Redux core utilities
import { createStore, combineReducers, applyMiddleware } from "redux";

// Middleware for async actions
import thunk from "redux-thunk";

// Developer tool extension for easier debugging
import { composeWithDevTools } from "redux-devtools-extension";

// Reducers for product and user states
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewsReducer, productsReducer, reviewReducer } from "./reducers/productReducer";
import { userReducer,profileReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducers, orderReducer } from "./reducers/orderReducer";


// Combine all reducers into one root reducer
const reducer = combineReducers({
  products: productsReducer,           // Handles product listing & filtering
  productDetails: productDetailsReducer, // Handles individual product detail
  user: userReducer, 
  profile : profileReducer,
  forgotPassword : forgotPasswordReducer,
  cart : cartReducer,
  newOrder : newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails : orderDetailsReducers,
  newReview: newReviewReducer,
  allOrders: allOrdersReducer, // <-- must match `state.allOrders`
  allUsers: allUsersReducer,     // <-- must match `state.allUsers`
  newProduct: newProductReducer,
  product:productReducer,
  order: orderReducer,
  userDetails: userDetailsReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,
            
});


// Initial state of the store
let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
       shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },

  
};


// Apply thunk middleware for handling async logic in actions
const middleware = [thunk];

// Create Redux store with middleware and Redux DevTools enabled
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// Export the configured store
export default store;
