import React, { useState, Fragment, useEffect } from "react";
import "./UpdatePassword.css";
import Loader from "../layout/Loader/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../actions/userAction.jsx";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstant.jsx";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, loading, isUpdated } = useSelector((state) => state.profile);

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    e.preventDefault(); // Prevents page reload on form submit

    // names should match with backend otherwise will get undefined error
    const myData = {
      oldpassword,
      newpassword,
      confirmpassword,
    };

    // console.log("Updating password with:", {
    //   oldpassword,
    //   newpassword,
    //   confirmpassword,
    // });
    dispatch(updatePassword(myData));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      // console.log("Updated!");
      alert.success("Password Updated Successfully...");

      navigate("/account", { replace: true });

      dispatch({
        type: UPDATE_PASSWORD_RESET, // to make isupdate false
      });
    }
  }, [dispatch, error, alert, navigate, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Profile</h2>

              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldpassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
