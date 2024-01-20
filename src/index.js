const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();

//Serving static files from the "public" folder
app.use("/static", express.static("public"));

// Setting up handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"));


app.get('/', (req, res) => {
    res.render('home', {
        title: "Home",
    });
});


console.log();

app.listen(5000, () => console.log("Server running on port 5000"));