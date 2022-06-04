const { stack } = require("../routes/productRoute");
const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // mongodb error

  if (err.name === "CastError") {
    const message = `Resource not found: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose key Error

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "jsonWebTokenError") {
    const message = "json web invalid token,try again later";
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "tokenExpireError") {
    const message = "json web token is expired ,try again";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    // error: err.stack, //isse pura error pta chal jata h
    // error: err.message, // isse message aata h error ka
    message: err.message,
  });
};
