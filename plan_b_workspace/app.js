var express             = require("express"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local");

mongoose.connect("mongodb://localhost/plan_b");

//Models
var User                = require("./models/user.js"),
    Time                = require("./models/planModels/time.js"),
    Text                = require("./models/planModels/text.js"),
    Box                 = require("./models/box.js");
//routers
var mainRoutes = require("./routes/main.js");
var authRoutes = require("./routes/auth.js");
//express app setting

var app = express();
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//passport setting
app.use(require("express-session")({
    secret: "gladosofaperturescienceexponentialpieplusoneiszero",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//

//app middleware

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});
//

app.get("/", isLoggedIn, function(req, res){
   res.redirect("/main"); 
});

app.set("view engine", "ejs");


//let express use included Route
app.use("/main", isLoggedIn, mainRoutes);
app.use("/", authRoutes);

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server is running.");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

