module.exports.get_register = function(req, res) {
    res.render('signup', {
        title: "Register"
    });
}

module.exports.post_register = function(req, res) {
    console.log(req.body);
    res.end();
}