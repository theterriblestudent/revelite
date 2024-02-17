const express = require("express");
const bodyParser = require("body-parser")
const { engine } = require("express-handlebars");
const path = require("path");
// const database = require("./database");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");

const app = express();

//Serving static files from the "public" folder
app.use("/static", express.static("public"));

//Registering Body Parser
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)

// Setting up handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"));

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

app.listen(5000, () => console.log("Server running on port 5000"));