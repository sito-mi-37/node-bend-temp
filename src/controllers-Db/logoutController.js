const User = require("../models/User");
const asyncHandler = require('express-async-handler')



const handleLogout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(403);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  }
  console.log(foundUser.refreshToken)
  foundUser.refreshToken = (foundUser.refreshToken).filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
});

module.exports = { handleLogout };
