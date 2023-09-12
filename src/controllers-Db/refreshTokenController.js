const jwt = require("jsonwebtoken");
const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  // verify if all fields were provided
  if (!cookies?.jwt) return res.sendStatus(403);

  const refreshToken = cookies.jwt;

  // Delete cookie after getting its refresh token
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  // verify if user exist
  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refreshToken Reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(401);
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    return res.sendStatus(401);
  }

  // Invalidate the refresh token by creating a new array of rt that doesn't include the old one
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if(err){
        foundUser.refreshToken = [...newRefreshTokenArray]
        const result = await foundUser.save()
        console.log(result)
      }

      if (err && decoded.username !== foundUser.username) {
        return res.sendStatus(403);
      }

      // refresh token still valid
      const username = decoded.username;
      const roles = Object.values(foundUser.roles);

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

      // also create and store a new refresh token everytime an access token is created
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
  
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      console.log(result)

      // by sending the new refresh token in the new cookie we are now implementing refresh token rotation
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
