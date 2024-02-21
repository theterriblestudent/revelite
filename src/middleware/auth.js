const jwt = require("jsonwebtoken");

function requiresAuth(req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decodedData) => {
            if (err) {
                res.status(401).send(err.message);
                res.redirect("/auth/login");
            }else {
                next();
            }
        })
    }else {
        res.status(401).send("Unauthorized!");
        res.redirect("/auth/login");
    }
}

function checkUser(req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decodedData) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next()
            }else {
                res.locals.user = decodedData;
                console.log(decodedData);
                next();
            }
        })
    }else {
        res.locals.user = null;
        next();
    }
}

module.exports  = {
    requiresAuth,
    checkUser,
}