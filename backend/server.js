const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const connectDB = require("./config/db");

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

//Establish DB connection
connectDB();

app.get("/", (req, res) => res.send("API is Running"));

// Defining Route
app.use("/api/auth", require("./routes/api/auth.js"));
app.use("/api/user", require("./routes/api/users.js"));
// FIX ME: THE FOLLOWING ROUTE IS NOT WORKING! I HAVE DISABLED THE REQUIRED FIELDS AND YET IT IS STILL RESULTING IN 404s INSTEAD OF 400s!
app.use("/api/flight", require("./routes/api/flight.js"));

app.use(errorHandler.handleNotFound);
app.use(errorHandler.handleError);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
