const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_TOKEN, { expiresIn: "2h" });
}

module.exports.register_post = async function(req, res) {
    const { first_name, last_name, password, email, phone } = req.body;

    const namesRegex = /^.{5,60}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^0\d{9}$/;

    if(namesRegex.test(first_name) && namesRegex.test(last_name) && passwordRegex.test(password) &&
       emailRegex.test(email) && phoneRegex.test(phone)) {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create(first_name, last_name, email, hashedPassword, phone);
        console.log(user);

        res.cookie("jwt", generateAccessToken(user), { maxAge: 7200000 * 2});
        res.status(201).json(user);
    } else {
        res.status(422).send("Invalid Data");
    }
}