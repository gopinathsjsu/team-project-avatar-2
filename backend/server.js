const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const connectDB = require("./config/db");
const passport = require("passport");
const { auth } = require("./utils/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(cors());
// (From) Shahbaz: Initializing/installing middleware; works using Express.js
//
app.use(
  express.json({
    extended: false,
  })
);

//passport.js setup
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    key: "user_sid",
    secret: "cmpe202secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 6000000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
auth();
//passport.js setup ends

//Establish DB connection
connectDB();

app.get("/", (req, res) => res.send("API is Running"));

// Defining Route
app.use("/api/auth", require("./routes/api/auth.js"));
app.use("/api/user", require("./routes/api/users.js"));
app.use("/api/flight", require("./routes/api/flight.js"));
app.use("/api/booking", require("./routes/api/booking.js"));
app.use("/api/seat", require("./routes/api/seat"));
//app.use("/api/airline", require("./routes/api/airline.js"));

app.use(errorHandler.handleNotFound);
app.use(errorHandler.handleError);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
