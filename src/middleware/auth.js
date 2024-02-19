const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports.requireAuth = function(req, res, next) {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, process.env.JWT_SECTRET_TOKEN, (error, token) => {
            if (error) {
                console.log(error.message);
                res.redirect("/auth/login");
            } else {
                next();
            }
        })
    } else {
        res.redirect("auth/login");
    }
}

module.exports.checkUser = function(req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (error, decodedToken) => {
            if(error) {
                console.log(error.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                const user = await User.findById(decodedToken.data);
                res.locals.user = user;
                console.log(user);
                next();
            }
        })
    }else {
        res.locals.user = null;
        next();
    }
}

