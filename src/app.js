const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cookeParser = require("cookie-parser");
const { engine } = require("express-handlebars");
const { authMiddleware } = require("./middleware"); 
const { authRouter, shopRouter } = require("./routes");
const { Product } = require("./models");


//Server instantiation
const app = express();

dotenv.config();

//Serving static files from the "public" folder
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookeParser());


// Setting up handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"));

app.get("*", [authMiddleware.checkUser,async  (req, res, next) => {
    if(res.locals.user) {
        res.locals.cart = await Product.getCart(res.locals.user.cart_id);
    }

    next();
}]);
app.post("*", authMiddleware.checkUser);
app.delete("*", authMiddleware.checkUser);

//Router
app.use("/shop" , shopRouter);
app.use("/auth", authRouter);


app.get('/', (req, res) => {
    res.render('home', {
        title: "Home",
    });
});

app.get('/services', (req, res) => {
    res.render('services', {
        title: "Services"
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About Us"
    });
})



console.log();

module.exports = app;