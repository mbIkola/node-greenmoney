import {capitalizeFirstCharAtKeys, validateNotEmpty, validateNumber, validateRegExp, validateUSPSState} from "./utils";

const request = require('request-promise-native');
//request.debug = true;
const usps = require('us-states');
const xml2js = require('xml2js').parseString;


class DraftResponse {
  constructor(params) {
    this.Result = params.Result;
    this.ResultDescription = params.ResultDescription;
    this.VerifyResult = params.VerifyResult;
    this.VerifyResultDescription = params.VerifyResultDescription;
    this.CheckNumber = params.CheckNumber;
    this.Check_ID = params.Check_ID;

    for (let x of Object.keys(this)) {
      console.log( x, this[x]);
      this[x] = Array.isArray(this[x]) ?  this[x].join(';') : this[x] ;
    }

    this.original = params;
  }

  toObject() {
    let res = Object.assign({}, this);
    delete res.original;
    return res;
  }
  isSuccess() {
    return "Who knows?";
  }
  toJSON() {
    return JSON.stringify(this.toObject());
  }
}


class GreenMoney {

  constructor(clientId, apiPassword, debug) {
    if ( debug ) {
      request.debug = true;
      require('request-debug')(request);
    }
    this.debug = debug || false;
    this.clientId = clientId;
    this.apiPassword = apiPassword;
    this.apiUrl =  'https://www.greenbyphone.com/eCheck.asmx/';

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
  oneTimeDraftRTV( name, phone, address1, city, state, zip, routingNumber, accountNumber, bankName, checkAmount, additionalOpts ) {
    let opts = {name, phone, address1, city, state, zip, routingNumber, accountNumber, bankName, checkAmount};

    if ( this.debug ) console.log("Opts: ", opts);
    Object.keys(opts).forEach(name => validateNotEmpty(name, opts[name]));
    checkAmount = ((checkAmount * 100) | 0) / 100.0;
    validateNumber('checkAmount', checkAmount);

    opts.checkAmount = checkAmount;

    const rules = {
      zip: /^[0-9]{5}(?:-[0-9]{4})?$/,
      phone: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
      state: /^[a-zA-Z]{2}$/
    };

    Object.keys(rules).forEach(name => validateRegExp(name, rules[name], opts[name]));
    validateUSPSState(opts.state);

    var d = new Date();
    todayDate = ('0' + d.getDate()).substr(-2) + '/' + ('0' + (d.getMonth()+1)).substr(-2) + '/' + (d.getFullYear());
    additionalOpts = Object.assign({
      EmailAddress : '',
      CheckMemo: '',
      CheckDate: todayDate,
      CheckNumber: '',
      PhoneExtension: '',
      Country: 'US',
      Address2: '',

    }, additionalOpts || {});



    opts = { ...opts, ...additionalOpts };



    return this.apiCall('OneTimeDraftRTV', opts);
  }

  apiCall(method, params) {
    let formData = capitalizeFirstCharAtKeys(params);
      formData.Client_ID = this.clientId;
      formData.ApiPassword = this.apiPassword;
      formData.x_delim_data = '';
      formData.x_delim_char = '';

      return request.post( { url: this.apiUrl + method, resolveWithFullResponse: true, simple: false } )
        .form(formData)
        .then( (response) => this.formatResponseBody(response))
        .then( (body) => new DraftResponse(body) )
  }

  formatResponseBody(response) {
    if ( response.status >= 400 ) {
      throw new Error(response.statusText);
    }
    //console.log("GreenMoney Response;", response, response.body);
    if ( /Request Rejected/.test(response.body) ) {
      if ( this.debug ) console.log( "GreenMoney Request rejected:", response.body);
      throw new Error(response.body);
    }

    return new Promise( (resolve, reject) => {
      xml2js(response.body, function(err, result) {
        if ( err ) {
          console.error("Could not parse XML:". err);
          reject(err);
        }
        resolve(result.DraftResult );
      });
    });
  }
}


export default GreenMoney;
