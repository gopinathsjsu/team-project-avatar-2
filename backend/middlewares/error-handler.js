"use strict";

const httpStatus = require("http-status");

exports.handleNotFound = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  res.json({
    message: "Requested resource not found",
  });
  res.end();
};

exports.handleError = (err, req, res, next) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err.errors,
  });
  res.end();
};
