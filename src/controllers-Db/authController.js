const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");



//@desc login user
//@route POST /auth
//@access public
const login = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  const { username, password } = req.body;

  // verify if all fields were provided
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  // verify if user exist
  // const foundUser = await User.findOne({username}).lean().exec()
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) return res.sendStatus(401);

  // verify password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
      );
      
      

    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        console.log("attempted refresh token reuse at login!");
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);

    res.status(200).json({ roles, accessToken });
  } else {
    return res.sendStatus(401);
  }
});

module.exports = {
  login,
};
