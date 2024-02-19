const bcrypt = require("bcrypt");
const User = require("../models/user");
const authUtils = require("../utils/auth");

module.exports.get_register = function(req, res) {
    res.render('signup', {
        title: "Register"
    });
}

module.exports.post_register = async function(req, res) {
    const { first_name, last_name, email, password, phone } = req.body;

    const errors = {
        name: [],
        surname: [],
        email: [],
        password: [],
        phone: []

    };

    function pushError(array, errorMessage) {
        array.push(errorMessage);
        errors.error = true;
    }
    
    if (!first_name) pushError(errors.name, "First name is required");
    else if (first_name.length > 60) pushError(errors.name, "Name is too long (Max 60)");

    if (!last_name)  pushError(errors.surname, "Last name is required");
    else if (last_name.length > 60)  pushError(errors.surname, "Last name is too long (Max 60)");
    
    const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!strongPassRegex.test(password)) pushError(errors.password, "Password is too weak");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) pushError(errors.email, "Invalid email address");

    const phoneRegex = /^(\+27|0)(\d{9})$/;
    if(!phoneRegex.test(phone)) pushError(errors.phone, "Invalid phone number");


    if(!errors.error) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user_id = await User.create(first_name, last_name, email, hashedPassword, phone);

        res.cookie("jwt", authUtils.generateAccessToken(user_id), {httpOnly: true, maxAge: 14400000});

        res.status(201).json({
            message: "Account created successfully",
            user_id
        });



    } else {
        res.status(422).json(errors);
    } 

    res.end();
}