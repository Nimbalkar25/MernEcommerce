import Header from "./components/layout/Header/Header.jsx";
import Footer from "./components/layout/Footer/Footer.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Webfont from "webfontloader";
import { useEffect, useState } from "react";
import Home from "./components/Home/Home.jsx";
import "./App.css";
import ProductDetails from "./components/Product/ProductDetails.jsx";
import Products from "./components/Product/Products.jsx";
import Search from "./components/Product/Search.jsx";
import LoginSignUp from "./components/User/LoginSignUp";
import Profile from "./components/User/Profile.jsx";
import store from "./store.jsx";
import { loadUser } from "./actions/userAction.jsx";
import UserOptions from "./components/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/Route/ProtectedRoute";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders.jsx";
import OrderDetails from "./components/Order/OrderDetails";
import Dashboard from "./components/Admin/Dashboard";
import ProductList from "./components/Admin/ProductList";
import NewProduct from "./components/Admin/NewProduct";
import UpdateProduct from "./components/Admin/UpdateProduct";
import OrderList from "./components/Admin/OrderList.jsx";
import ProcessOrder from "./components/Admin/ProcessOrder.jsx";
import UsersList from "./components/Admin/UsersList.jsx";
import UpdateUser from "./components/Admin/UpdateUser.jsx";
import ProductReviews from "./components/Admin/ProductReviews.jsx";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Contact from "./components/layout/Contact/Contact.jsx";
import About from "./components/layout/About/About.jsx";
import NotFound from "./components/layout/NotFound/NotFound.jsx";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripePromise, setStripePromise] = useState(null);

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      const promise = loadStripe(data.stripeApiKey);
      setStripePromise(promise);
    } catch (error) {
      console.error("Failed to load Stripe API key:", error);
    }
  }

  useEffect(() => {
    Webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    getStripeApiKey();
    store.dispatch(loadUser());
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/reviews" element={<ProductReviews />} />
        </Route>

        {/* Stripe Payment (Special handling) */}
        <Route
          path="/process/payment"
          element={
            stripePromise ? (
              <Elements stripe={stripePromise}>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </Elements>
            ) : (
              <div>Loading Stripe...</div>
            )
          }
        />

        {/* Catch-all for 404 */}
        <Route
          path="*"
          element={
            window.location.pathname === "/process/payment" ? null : (
              <NotFound />
            )
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
  