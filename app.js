const morgan = require( "morgan" );
const path = require( "path" );
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// listing api
app.use("/api/v1/auth", require("./routes/api_auth.js"));
app.use("/api/v1/user", require("./routes/api_user.js"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).json({
        status: 0,
        code: "NOT_FOUND",
        data: {}
    })
});
// error handler
app.use(function(err, req, res, next) {
   res.status(500).json({
       status: 0,
       code: "INTERNAL_SERVER_ERROR",
       data: {}
   })
});
module.exports = app;
