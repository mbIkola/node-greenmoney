"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _utils = require("./utils");

var request = require('request-promise-native');

var usps = require('us-states');

var xml2js = require('xml2js').parseString;

var DraftResponse =
/*#__PURE__*/
function () {
  function DraftResponse(params) {
    (0, _classCallCheck2.default)(this, DraftResponse);
    this.Result = undefined;
    this.ResultDescription = undefined;
    this.VerifyResult = undefined;
    this.VerifyResyltDescription = undefined;
    this.CheckNumber = undefined;
    this.Check_ID = undefined;

    for (var x in params.DraftResult) {
      this[x] = params.DraftResult[x];
    }

    this.original = params;
  }

  (0, _createClass2.default)(DraftResponse, [{
    key: "toObject",
    value: function toObject() {
      var res = (0, _assign.default)({}, this);
      delete res.original;
      return res;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return (0, _stringify.default)(this.toObject());
    }
  }]);
  return DraftResponse;
}();

var GreenMoney =
/*#__PURE__*/
function () {
  function GreenMoney(clientId, apiPassword) {
    (0, _classCallCheck2.default)(this, GreenMoney);
    this.clientId = clientId;
    this.apiPassword = apiPassword;
    this.apiUrl = 'https://www.greenbyphone.com/eCheck.asmx';
  }
  /**
   * ONETIMEDRAFTRTV – ONE-TIME DRAFT REAL-TIME VERIFICATION
   * OneTimeDraftRTV allows you to enter a single one-time draft check with real-time verification. OneTimeDraftRTV
   * shares the same inputs and outputs as OneTimeDraftBV.
   *
   * @param name {string} Your customer’s name on their checking account.
   * @param phone {string} Your customer’s 10-digit phone number in the format 999-999-9999.
   * @param address1 {string} Your customer’s street number and street name.
   * @param city {string} Your customer’s city.
   * @param state {string} Your customer’s TWO DIGIT state abbreviation (ex: GA, NY, FL, CA, etc.). @see us-states npm package for details
   * @param zip {string} Your customer’s 5-digit or 9-digit zip code in the format 99999 or 99999-9999.
   * @param routingNumber {string} Your customer’s 9-digit bank routing number.
   * @param accountNumber {string} Your customer’s bank account number
   * @param bankName {string} Your customer’s bank name (ex: Wachovia, BB&T, etc.)
   * @param checkAmount {Number} Check amount in the format 99.99. Do not include Monetary Symbols like $.
   * @param additionalOpts {object} Optionally you can override some additional options listed below:
   *  • EmailAddress - Your customer’s email address. Used for notification process. Note: This is not required,
   *    but if it is not provided, notification will be made via US Mail at an additional cost. Contact Customer
   *    service for details.
   *  • PhoneExtension – Your customer’s phone extension.
   *  • Address2 - Your customer’s additional address information (ex: Suite #, Floor #, etc.).
   *  • Country - Your customer’s 2-character country code, ex: “US”. "US" by default.
   *  • CheckMemo – Memo section from your customer’s check
   *  • CheckDate* - Check date in the format mm/dd/yyyy. Check date can be from 2 months prior to 1 year in the future. 2 months from now by default
   *
   * @return {Promise<DraftResponse>}
   */


  (0, _createClass2.default)(GreenMoney, [{
    key: "oneTimeDraftRTV",
    value: function oneTimeDraftRTV(name, phone, address1, city, state, zip, routingNumber, accountNumber, bankName, checkAmount, additionalOpts) {
      var opts = {
        name: name,
        phone: phone,
        address1: address1,
        city: city,
        state: state,
        zip: zip,
        routingNumber: routingNumber,
        accountNumber: accountNumber,
        bankName: bankName
      };
      (0, _keys.default)(opts).forEach(function (name) {
        return (0, _utils.validateNotEmpty)(name, opts[name]);
      });
      checkAmount = (checkAmount * 100 | 0) / 100.0;
      (0, _utils.validateNumber)('checkAmount', checkAmount);
      opts.checkAmount = checkAmount;
      var rules = {
        zip: /^[0-9]{5}(?:-[0-9]{4})?$/,
        phone: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
        state: /^[a-zA-Z]{2}$/
      };
      (0, _keys.default)(rules).forEach(function (name) {
        return (0, _utils.validateRegExp)(name, rules[name], opts[name]);
      });
      (0, _utils.validateUSPSState)(opts.state);
      opts = (0, _extends2.default)({}, opts, additionalOpts);
      return this.apiCall('OneTimeDraftRTV', opts);
    }
  }, {
    key: "apiCall",
    value: function apiCall(method, params) {
      var _this = this;

      var formData = (0, _utils.capitalizeFirstCharAtKeys)(params);
      formData.Client_ID = this.clientId;
      formData.ApiPassword = this.apiPassword;
      return request.post({
        url: this.apiUrl,
        formData: formData
      }).then(function (response) {
        return _this.formatResponseBody(response);
      }).then(function (body) {
        return new DraftResponse(body);
      });
    }
  }, {
    key: "formatResponseBody",
    value: function formatResponseBody(response) {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }

      console.log(response.body);
      return new xml2js(response.body);
    }
  }]);
  return GreenMoney;
}();

var _default = GreenMoney;
exports.default = _default; //# sourceMappingURL=GreenMoney.js.map
//# sourceMappingURL=GreenMoney.js.map
//# sourceMappingURL=GreenMoney.js.map
//# sourceMappingURL=GreenMoney.js.map
//# sourceMappingURL=GreenMoney.js.map