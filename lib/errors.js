'use strict';

exports.badRequest = res => {
  res.statusCode = 400;
  res.end('Bad Request');
};

exports.notFound = res => {
  res.statusCode = 404;
  res.end('Not Found');
};
