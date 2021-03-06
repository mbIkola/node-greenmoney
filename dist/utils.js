"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNotEmpty = validateNotEmpty;
exports.validateNumber = validateNumber;
exports.validateRegExp = validateRegExp;
exports.validateUSPSState = validateUSPSState;
exports.ucFirst = ucFirst;
exports.capitalizeFirstCharAtKeys = capitalizeFirstCharAtKeys;

var usps = require('us-states');

function validateNotEmpty(keyname, str) {
  if (typeof str !== "string" && str.length == 0) {
    throw new Error(400, keyname + " are required and can't be empty ");
  }
}

function validateNumber(keyname, num) {
  if (num * 1.0 <= 0 || isNaN(num) || typeof num !== 'number') {
    throw new Error(400, keyname + " should be a number");
  }
}

function validateRegExp(keyname, regex, value) {
  if (!regex.test(value)) {
    throw new Error(400, keyname + " doesn't match exepcted form " + regex.toString());
  }
}

function validateUSPSState(stateId) {
  if (typeof usps[stateId] === "undefined") {
    throw new Error(400, "Invalid USPS state code: " + stateId);
  }
}

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeFirstCharAtKeys(params) {
  return Object.keys(params).map(function (key) {
    return [ucFirst(key), params[key]];
  }).reduce(function (acc, current) {
    acc[current[0]] = current[1];
    return acc;
  }, {});
}