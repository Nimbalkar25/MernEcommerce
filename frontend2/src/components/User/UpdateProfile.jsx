import React, { useState, Fragment, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
// MUI icons
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FaceIcon from "@mui/icons-material/Face";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  updateProfile,
  loadUser,
} from "../../actions/userAction.jsx";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstant.jsx";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { error, loading, isUpdated } = useSelector((state) => state.profile);

  // State for profile image (avatar) and preview image
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateProfileSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submit

    const myForm = new FormData(); // Create a form data object to send file/image easily

    myForm.set("name", name);
    myForm.set("email", email);

    if (avatar && typeof avatar !== "string") {
      myForm.append("avatar", avatar);
    }
    //     console.log("🚀 SUBMITTING:", {
    //   name,
    //   email,
    //   avatar,
    // });

    dispatch(updateProfile(myForm));
    // Future: You’ll dispatch register action with `myForm`
  };

  // 🟦 Handle input changes in register form
  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file); // ✅ Required!
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      // console.log("Updated!");
      alert.success("Profile Updated Successfully...");
      dispatch(loadUser());

      // setTimeout(() => {
      //   console.log("🧠 Redux user after loadUser:", user);
      // }, 1000);

      navigate("/account", { replace: true });

      dispatch({
        type: UPDATE_PROFILE_RESET, // to make isupdate false
      });
    }
  }, [dispatch, error, alert, navigate, user, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
