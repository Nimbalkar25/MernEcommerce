// Creating token and saving in cookie

const sendToken = (user, statusode, res) => {
  const token = user.getJWTToken();

  // options for  cookies
  const options = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

//   // Manually pick only public fields
//   const safeUser = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     avatar: user.avatar,
//   };

  res.status(statusode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
