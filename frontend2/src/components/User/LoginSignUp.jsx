import React, { useRef, useState, Fragment, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "react-alert";
// MUI icons
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction.jsx";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  //Redux tool not working as expected so for confirmation we getting use state or not this line
  // console.log(
  //   "State from Redux:",
  //   useSelector((state) => state.user)
  // );

  // Refs for tab switching (login/register)
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  // State for login inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for register inputs
  const [ruser, setrUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Destructure user object
  const { name, email, password } = ruser;

  // State for profile image (avatar) and preview image
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // 🟩 Submit handler for login form
  const loginSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    dispatch(login(loginEmail, loginPassword));
  };

  // 🟩 Submit handler for register form
  const registerSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submit

    const myForm = new FormData(); // Create a form data object to send file/image easily

    myForm.set("name", ruser.name);
    myForm.set("email", ruser.email);
    myForm.set("password", ruser.password);

    myForm.append("avatar", avatar); // 👈 Correct

    dispatch(register(myForm));
    // Future: You’ll dispatch register action with `myForm`
  };

  // 🟦 Handle input changes in register form
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        setAvatar(file); // ✅ Required!
        setAvatarPreview(URL.createObjectURL(file));
      }
    } else {
      setrUser({ ...ruser, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      const searchParams = new URLSearchParams(location.search);
      const redirectQuery = searchParams.get("redirect");
      const redirectPath =
        redirectQuery || location.state?.from?.pathname || "/account";
      navigate(redirectPath);
    }
  }, [dispatch, error, alert, navigate, isAuthenticated, location]);

  // 🔁 Function to switch between Login and Register tabs
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeuteral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }

    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeuteral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="LoginSignUpContainer">
          <div className="LoginSignUpBox">
            {/* Tab Toggle Buttons */}
            <div>
              <div className="login_signUp_toggle">
                <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
              </div>
              <button ref={switcherTab}></button> {/* Animated toggle bar */}
            </div>

            {/* 🔐 Login Form */}
            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
              <div className="loginEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="loginPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              {/* Forgot Password Link */}
              <Link to="/password/forgot">Forgot Password ?</Link>

              {/* Submit Button */}
              <input type="submit" value="Login" className="loginBtn" />
            </form>

            {/* 🧾 Register Form */}
            <form
              className="signUpForm"
              ref={registerTab}
              encType="multipart/form-data"
              onSubmit={registerSubmit}
            >
              <div className="signUpName">
                <FaceIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  value={name}
                  onChange={registerDataChange}
                />
              </div>

              <div className="signUpEmail">
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  value={email}
                  onChange={registerDataChange}
                />
              </div>

              <div className="signUpPassword">
                <LockOpenIcon />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  value={password}
                  onChange={registerDataChange}
                />
              </div>

              {/* Avatar Upload with Preview */}
              <div id="registerImage">
                <img src={avatarPreview} alt="Avatar Preview" />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={registerDataChange}
                />
              </div>

              {/* Submit Button */}
              <input type="submit" value="Register" className="signUpBtn" />
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
