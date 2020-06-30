const crypto = require("crypto"); //create secure unique random values
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrigTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const User = require("../models/user");

//SendGrid
const transporter = nodemailer.createTransport(
  sendgrigTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

//Gmail
/*
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL_ACCOUNT,
        pass: process.env.GMAIL_EMAIL_PASSWORD,
    },
});
*/

exports.getLogin = (req, res, next) => {
  //pass the name of the message
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else message = null;

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else message = null;

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      //if user doesn't exist
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: errors.array()[0].msg,
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [{ param: "email", param: "password" }],
        });
      }
      //else
      bcrypt
        .compare(password, user.password) //returns true if passwords are equal
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }

          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: errors.array()[0].msg,
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    }); //render to the same page for not to refresh the page
  }

  //hash the password
  bcrypt
    .hash(password, 12) //pass the password and the number of iterations for the encription
    .then((hashedPassword) => {
      const user = User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      user.save();
    })
    .then((result) => {
      let mailOptions = {
        from: process.env.EMAIL_ACCOUNT_FROM,
        to: email,
        subject: "Welcome to Enrishop, signup succeeded!",
        html: "<h1>Welcome to Enrishop, you succesfully signed up!</h1>",
      };

      res.redirect("/login");
      return transporter.sendMail(mailOptions);
    })
    .then((err, info) => {
      if (err) return console.log(err);
      else return console.log("Email sent: " + info.response);
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else message = null;

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  //Create the token
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        //if no user found
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }

        //if user found
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; //plus one hour
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: process.env.EMAIL_ACCOUNT_FROM,
          subject: "Password reset",
          html: `
                      <h1>You requested a password reset</h1>
                      <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                    `,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  //Check if token matches and expiration date is greater than now
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else message = null;

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New password",
        errorMessage: message,
        userId: user._id.toString(), //send the userId for the POST request
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
