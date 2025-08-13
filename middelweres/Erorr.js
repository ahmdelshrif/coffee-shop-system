const ApiError = require("../utils/apiError");

const errorDetection = (err) => {
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ApiError(message, 400);
  }
  return err;
};

exports.globalEorrs = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err = errorDetection(err);

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  if (err.name === "JsonWebTokenError") {
    err = new ApiError("Invalid token", 400);
  } else if (err.name === "TokenExpiredError") {
    err = new ApiError("Expired token", 400);
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
