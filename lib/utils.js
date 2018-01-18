
const usps = require('us-states');

export function validateNotEmpty(keyname, str) {
  if ( typeof str !== "string"  && str.length == 0 ) {
    throw new Error(400, keyname + " are required and can't be empty " );
  }
}
export function validateNumber(keyname, num) {
  if ( num * 1.0  <= 0 || isNaN(num) || typeof num !== 'number') {
    throw new Error(400, keyname + " should be a number");
  }
}
export function validateRegExp(keyname, regex, value)  {
  if ( ! regex.test(value) ) {
    throw new Error(400, keyname + " doesn't match exepcted form " + regex.toString());
  }
}
export function validateUSPSState(stateId)  {
  if ( typeof usps[stateId] === "undefined" ) {
    throw new Error(400, "Invalid USPS state code: " + stateId);
  }
}
export function ucFirst(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

export function capitalizeFirstCharAtKeys ( params )  {
  return Object.keys(params)
    .map(key => [ucFirst(key), params[key]])
    .reduce((acc, current) => {
      acc[current[0]] = current[1];
      return acc
    }, {});
}



