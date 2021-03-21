const express = require("express");
const { v4: uuidv4 } = require('uuid');
const yup = require("yup");
const pick = require("lodash/pick");

const User = require('../users/users.model');
const AuthUtils = require('./auth.utils');
const router = express.Router();

const getUserData = (user, accessToken) => ({
  ...pick(user, ["id", "name", "username", "email"]),
  accessTokenExpiry: new Date(new Date().getTime() + (AuthUtils.JWT_TOKEN_EXPIRES * 60 * 1000)),
  accessToken,
});

const userSchemaSignup = yup.object().shape({
  name: yup
    .string()
    .trim(),
  username: yup
    .string()
    .trim()
    .min(2)
    .required(),
  refreshToken: yup
    .string()
    .trim(),
  email: yup
    .string()
    .trim()
    .email()
    .required(),
  password: yup
    .string()
    .min(8, "password must be at least 8 characters")
    .max(100)
    .matches(/[^a-zA-Z0-9]/, "password must contain a special character")
    .matches(/[a-z]/, "password must contain a lower case letter")
    .matches(/[A-Z]/, "password must contain an upper case letter")
    .matches(/[0-9]/, "password must contain a number")
    .required(),
});

const userSchemaSignin = yup.object().shape({
  name: yup
    .string()
    .trim(),
  username: yup
    .string()
    .trim()
    .min(2),
  refreshToken: yup
    .string()
    .trim(),
  email: yup
    .string()
    .trim()
    .email()
    .required(),
  password: yup
    .string()
    .min(8, "password must be at least 8 characters")
    .max(100)
    .matches(/[^a-zA-Z0-9]/, "password must contain a special character")
    .matches(/[a-z]/, "password must contain an upper case letter")
    .matches(/[A-Z]/, "password must contain a lower case letter")
    .matches(/[0-9]/, "password must contain a number")
    .required(),
});

router.post("/signup", async (req, res, next) => {
  try {
    const { name, password, username } = req.body;
    const email = req.body.email.toLowerCase();
    const newUser = { email, name, password, username };
    await userSchemaSignup.validate(newUser, { abortEarly: false });
    const existingUser = await User.query().where({ email }).first();
    if (existingUser) {
      const error = new Error("Email already in use");
      res.status(403);
      throw error;
    }
    const hashedPassword = await AuthUtils.hashPassword(password);
    const refreshToken = uuidv4();
    const insertedUser = await User.query().insert({ name, username, refreshToken, email, password: hashedPassword });
    const accessToken = await AuthUtils.sign(insertedUser);

    res.cookie('refreshToken', refreshToken, {
      maxAge: AuthUtils.REFRESH_TOKEN_EXPIRES * 60 * 1000, // 30d convert from minute to milliseconds
      httpOnly: true,
      secure: false,
    });
    res.json({
      message: "user successfully registered",
      user: getUserData(insertedUser, accessToken),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { password, name = "used for validation", username = "used for validation" } = req.body;
    const email = req.body.email.toLowerCase();
    const loggingUser = { email, password, name, username };
    await userSchemaSignin.validate(loggingUser, { abortEarly: false });
    const existingUser = await User.query().where({ email }).first();
    if (!existingUser) {
      return AuthUtils.authFailed(res);
    }
    const isValidPassword = await AuthUtils.comparePasswords(existingUser.password, password);

    if (!isValidPassword) {
      return AuthUtils.authFailed(res);
    }
    const accessToken = await AuthUtils.sign(existingUser);
    const refreshToken = uuidv4();
    await AuthUtils.updateRefreshTokenByUserId({ refreshToken, id: existingUser.id });
    res.cookie('refreshToken', refreshToken, {
      maxAge: AuthUtils.REFRESH_TOKEN_EXPIRES * 60 * 1000, // convert from minute to milliseconds
      httpOnly: true,
      secure: false,
    });
    res.json({
      message: "ok",
      user: getUserData(existingUser, accessToken),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/signout', (req, res, next) => {
  res.cookie('refreshToken', " ", {
    httpOnly: true,
    expires: new Date(0),
  });
  // TODO blacklist accesstoken
  res.send('successfully logout');
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const existingUser = await AuthUtils.getUserByRefreshToken(req.cookies.refreshToken);

    if (!existingUser) {
      return AuthUtils.authFailed(res);
    }
    const accessToken = await AuthUtils.sign(existingUser);
    const refreshToken = uuidv4();
    await AuthUtils.updateRefreshTokenByUserId({ refreshToken, id: existingUser.id });
    res.cookie('refreshToken', refreshToken, {
      maxAge: AuthUtils.REFRESH_TOKEN_EXPIRES * 60 * 1000, // convert from minute to milliseconds
      httpOnly: true,
      secure: false,
    });
    res.json({
      message: "successfully refreshed",
      user: getUserData(existingUser, accessToken),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
