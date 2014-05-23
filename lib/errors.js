'use strict';

exports.badRequest = function(res) {
  res.statusCode = 400;
  res.end('Bad Request');
};

exports.notFound = function(res) {
  res.statusCode = 404;
  res.end('Not Found');
};
