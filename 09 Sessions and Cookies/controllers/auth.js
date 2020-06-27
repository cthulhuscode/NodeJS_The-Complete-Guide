const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    //Accessing to a cookie
    //const isLoggedIn = req.get("Cookie").trim().split("=")[1] === "true";
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    //Create a cookie to be authenticated
    //Set-Cookie is a reserved word
    //Configurations of a cookie:
    //Expires=
    //Max-Age= -- time in seconds of its duration
    //Domain=  -- for tracking
    //Secure -- the cookie only be set if the page uses https
    //HttpOnly  -- the cookie cannot be read through javascript scripts (malicious code)

    /* Cookie */
    //res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");

    /* Session */
    User.findById("5ef64336685243278c8c8c16")
        .then((user) => {
            //saving user in a session
            req.session.user = user;
            req.session.isLoggedIn = true;

            //save() is used to be sure that was saved, and then render the page
            req.session.save((err) => {
                console.log(err);
                res.redirect("/");
            });
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    //Delete a session
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
