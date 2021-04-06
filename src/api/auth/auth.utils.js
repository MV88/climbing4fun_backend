const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CYCLES_FOR_PASSWORD } = require("../../constants/project");
const catch500Error = (res, error) => {
  console.log("error", error);
  res.status(500).json({ error });
};

const User = require("../users/users.model");
const REFRESH_TOKEN_EXPIRES = 30 * 24 * 60; // 30d in minutes
const JWT_TOKEN_EXPIRES = 150000; // minutes
// TODO restore token expiration to 15m
const authFailed = (res) => res.status(401).json({ message: "Auth failed" });

/**
 * it hashes a password
 * @param {string} pwd
 * @return {Promise} the Promise that will generate the hash
 */
const hashPassword = (pwd) => bcrypt.hash(pwd, CYCLES_FOR_PASSWORD);

const sign = ({ id, name, username }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id, name, username },
      process.env.JWT_SECRET,
      {
        expiresIn: `${JWT_TOKEN_EXPIRES}m`,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        return resolve(token);
      }
    );
  });
};
const updateRefreshTokenByUserId = ({ refreshToken, id }) => {
  return User.query().update({ refreshToken }).where({ id });
};

const getUserByRefreshToken = (refreshToken) => {
  return User.query().where({ refreshToken }).first();
};
const comparePasswords = (userPwdFromDB, notHashedPWD) => {
  return bcrypt.compare(notHashedPWD, userPwdFromDB);
};

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // remove Bearer
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;

    next(); // if succeed
  } catch (error) {
    console.error(error);
    return authFailed(res);
  }
};

module.exports = {
  authFailed,
  catch500Error,
  checkAuth,
  comparePasswords,
  hashPassword,
  getUserByRefreshToken,
  updateRefreshTokenByUserId,
  sign,
  REFRESH_TOKEN_EXPIRES,
  JWT_TOKEN_EXPIRES,
};
