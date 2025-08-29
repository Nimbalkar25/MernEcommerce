import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  CLEAR_ERRORS,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_RESET,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_RESET,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_RESET,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_RESET,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  ALL_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_RESET,
} from "../constants/productConstants";

export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCT_REQUEST:
    case ADMIN_PRODUCT_REQUEST:
      // Return loading state with an empty products array when a request is made
      return {
        loading: true,
        ...state,
      };

    case ALL_PRODUCT_SUCCESS:
      // This action should contain the products and the product count (make sure your backend returns these correctly)
      return {
        loading: false,
        products: action.payload.products, // Array of products
        productsCount: action.payload.productsCount, // Total count of products
        resultPerPage: action.payload.resultPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
      };

    case ADMIN_PRODUCT_SUCCESS:
      return {
        loading: false,
        products: action.payload,
      };

    case ALL_PRODUCT_FAIL:
    case ADMIN_PRODUCT_FAIL:
      // If the request fails, return the error message
      return {
        ...state,
        loading: false,
        error: action.payload, // Error message from the action
      };

    case CLEAR_ERRORS:
      // Reset the error state when clearing errors
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

//create new product

export const newProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NEW_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        product: action.payload.product,
      };
    case NEW_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_PRODUCT_RESET:
      return {
        ...state,
        success: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// delete and update product

export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
      case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_PRODUCT_FAIL:
      case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_PRODUCT_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case UPDATE_PRODUCT_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// This reducer manages the state for a single product's details page.
// It handles loading status, product data, and errors.

export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    // When product details are being fetched, set loading to true
    case PRODUCT_DETAILS_REQUEST:
      return {
        loading: true, // show loader/spinner
        ...state, // keep any existing state (important if data exists from before)
      };

    // When the API returns product data successfully
    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false, // stop loader
        product: action.payload, // store the fetched product in state
      };

    // When the API call fails (e.g., network error or invalid product ID)
    case PRODUCT_DETAILS_FAIL:
      return {
        loading: false, // stop loader
        error: action.payload, // store the error message
      };

    // When we want to manually clear any previous errors (e.g., on component unmount or user retry)
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null, // reset the error to null
      };

    // Return current state by default if no relevant action is found
    default:
      return state;
  }
};

export const newReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case NEW_REVIEW_SUCCESS:
      return {
        loading: false,
        success: action.payload,
      };

    case NEW_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case NEW_REVIEW_RESET:
      return {
        ...state,
        success: false,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};


export const productReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case ALL_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_REVIEW_SUCCESS:
      return {
        loading: false,
        reviews: action.payload,
      };
    case ALL_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case DELETE_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_REVIEW_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};