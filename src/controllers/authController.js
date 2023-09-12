const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const fsPromises = require("fs").promises;
const path = require("path");

const usersDb = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

//@desc login user
//@route POST /auth
//@access public

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // verify if all fields were provided
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  // verify if user exist
  // const foundUser = await User.findOne({username}).lean().exec()
  const foundUser = usersDb.users.find((user) => user.username === username);
  if (!foundUser) return res.sendStatus(401);

  // verify password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);
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
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    const otherUsers = usersDb.users.filter(
      (user) => user.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDb.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDb.users)
    );

    res.status(200).json({ accessToken });
  } else {
    return res.sendStatus(401);
  }

  // if(match){
  //     // create an accessToken
  //     const accessToken = jwt.sign(
  //         {
  //             "UserInfo" : {
  //                 "username": foundUser.username
  //             }
  //         }, process.env.ACCESS_TOKEN_SECRET,
  //         {
  //             expiresIn: '20s'
  //         }
  //     )

  //     // create refreshToken
  //     const refreshToken = jwt.sign(
  //         {
  //             "UserInfo" : {
  //                 "username": foundUser.username
  //             }
  //         }, process.env.REFRESH_TOKEN_SECRET,
  //         {
  //             expiresIn: '30s'
  //         }
  //     )

  //     //create cookie and use the refreshToken as payload

  //     res.cookie('jwt', refreshToken, {
  //         maxAge: 7 * 24 * 60 * 60 * 60,
  //         httpOnly: true,
  //         secure: true
  //     })

  //     res.status(200).json({accessToken})

  // }else{
  //     res.status(400).json({message: "Invalid credentials"})
  // }
});

const refresh = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) {
    res.status(403).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.decode(refreshToken, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: "Deformed token" });
    } else {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "4s",
        }
      );

      res.status(200).json(accessToken);
    }
  });
};

module.exports = {
  login,
  refresh,
};
