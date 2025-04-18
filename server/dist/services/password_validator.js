"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStrongPassword = void 0;
var isStrongPassword = exports.isStrongPassword = function isStrongPassword(password) {
  var PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=(){}\[\]])[A-Za-z\d@$!%*?&#^+=(){}\[\]]{8,}$/;
  return PASSWORD_REGEX.test(password);
};