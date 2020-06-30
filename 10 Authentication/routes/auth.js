const express = require("express");
const { check, body, param, query, header } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(), //sanitize input
    body("password", "Please enter a correct password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

//Validating the input with 'email' name, the name cares for validating
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email") //specific error message

      .custom((value, { req }) => {
        //asynchronous validation
        //express-validator will await for the finishing promise, the reject will be take as any other error
        return User.findOne({ email: value }).then((userDoc) => {
          //If already exists return signup page
          if (userDoc) {
            return Promise.reject(
              "Email exists already, please pick a different one"
            );
          }
        });
      })
      .normalizeEmail(),

    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters" //default error message
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),

    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("The passwords must match");
        } else return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
