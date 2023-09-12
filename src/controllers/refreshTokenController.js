const jwt = require("jsonwebtoken");
const usersDb = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  // verify if all fields were provided
  if (!cookies?.jwt) return res.sendStatus(403);

  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // verify if user exist
  // const foundUser = await User.findOne({username}).lean().exec()
  const foundUser = usersDb.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err && decoded.username !== foundUser.username){
      return res.sendStatus(403);
    }
    console.log(decoded)
    const username = decoded.username;
    const roles = Object.values(foundUser.roles)

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.username,
          "roles": roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
