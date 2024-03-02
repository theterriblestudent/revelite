const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_TOKEN, { expiresIn: "2h" });
}

module.exports.register_post = async function(req, res) {
    const { first_name, last_name, password, email, phone } = req.body;

    const namesRegex = /^.{1,60}$/;
    const phoneRegex = /^0\d{9}$/;

    if(namesRegex.test(first_name) && namesRegex.test(last_name) && passwordRegex.test(password) &&
       emailRegex.test(email) && phoneRegex.test(phone)) {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = await User.create(first_name, last_name, email, hashedPassword, phone);

            res.cookie("jwt", generateAccessToken(user), { maxAge: 7200000 * 2});
            res.status(200).json({message: "Signup Successful", user});
        }catch(error) {
            if (error.code === "23505" && error.constraint === "email_u") {
                res.status(400).json({message: "An account using this email address already exists", target: "email"});
            }
            if (error.code === "23505" && error.constraint === "phone_u") {
                res.status(400).json({message: "An account using this phone number already exists", target: "phone"});
            }else {
                console.log(error);
            }
        }
    } else {
        res.status(422).json({message: "Invalid Data"});
    }
}

module.exports.login_post = async function(req, res) {
    const { email, password } = req.body;

    if (emailRegex.test(email) && passwordRegex.test(password)) {
        try {
            const user = await User.findByEmail(email);

            const auth = await bcrypt.compare(password, user.password);

            if (auth) {
                res.cookie("jwt", generateAccessToken(user), {maxAge: 7200000 * 2});
                res.status(200).json({message: "Login Successful", user});
            }else {
                res.status(422).json({message: "Wrong email or password"});
            }

        }catch(error) {
            res.status(404).json({message: "Wrong email or password"});
        }
    }else{
        res.status(422).json({message: "Invalid Credentials!"});
    }
}

module.exports.logout_get = function(req, res) {
    res.cookie("jwt", "");
    res.redirect("/");
}