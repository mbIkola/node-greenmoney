"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _utils = require("./utils");

var request = require('request-promise-native'); //request.debug = true;


var usps = require('us-states');

var xml2js = require('xml2js').parseString;

var DraftResponse =
/*#__PURE__*/
function () {
  function DraftResponse(params) {
    (0, _classCallCheck2.default)(this, DraftResponse);
    this.Result = params.Result;
    this.ResultDescription = params.ResultDescription;
    this.VerifyResult = params.VerifyResult;
    this.VerifyResultDescription = params.VerifyResultDescription;
    this.CheckNumber = params.CheckNumber;
    this.Check_ID = params.Check_ID;

    var _arr = (0, _keys.default)(this);

    for (var _i = 0; _i < _arr.length; _i++) {
      var x = _arr[_i];
      console.log(x, this[x]);
      this[x] = Array.isArray(this[x]) ? this[x].join(';') : this[x];
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
    key: "isSuccess",
    value: function isSuccess() {
      return "Who knows?";
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
  function GreenMoney(clientId, apiPassword, debug) {
    (0, _classCallCheck2.default)(this, GreenMoney);

    if (debug) {
      request.debug = true;

      require('request-debug')(request);
    }

    this.debug = debug || false;
    this.clientId = clientId;
    this.apiPassword = apiPassword;
    this.apiUrl = 'https://www.greenbyphone.com/eCheck.asmx/';
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
        bankName: bankName,
        checkAmount: checkAmount
      };
      if (this.debug) console.log("Opts: ", opts);
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
      var d = new Date();
      var todayDate = ('0' + d.getDate()).substr(-2) + '/' + ('0' + (d.getMonth() + 1)).substr(-2) + '/' + d.getFullYear();
      additionalOpts = (0, _assign.default)({
        EmailAddress: '',
        CheckMemo: '',
        CheckDate: todayDate,
        CheckNumber: '',
        PhoneExtension: '',
        Country: 'US',
        Address2: ''
      }, additionalOpts || {});
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
      formData.x_delim_data = '';
      formData.x_delim_char = '';
      return request.post({
        url: this.apiUrl + method,
        resolveWithFullResponse: true,
        simple: false
      }).form(formData).then(function (response) {
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
      } //console.log("GreenMoney Response;", response, response.body);


      if (/Request Rejected/.test(response.body)) {
        if (this.debug) console.log("GreenMoney Request rejected:", response.body);
        throw new Error(response.body);
      }

      return new _promise.default(function (resolve, reject) {
        xml2js(response.body, function (err, result) {
          if (err) {
            console.error("Could not parse XML:".err);
            reject(err);
          }

          resolve(result.DraftResult);
        });
      });
    }
  }]);
  return GreenMoney;
}();

var _default = GreenMoney;
exports.default = _default;