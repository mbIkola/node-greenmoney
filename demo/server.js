/* eslint-disable no-console */

const express= require('express');
const app = express();
const opn = require('opn');
const bodyParser = require('body-parser');

const Greenmoney = require('../index.js');

const GREENMONEY_CLIENT_ID = "ClientID";
const GREENMONEY_API_PASSWORD="APIPassword";

const greenmoney = new Greenmoney(GREENMONEY_CLIENT_ID, GREENMONEY_API_PASSWORD, true);

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.render('echeck', {usps: require('us-states'), title: "Bullshit"});
});

app.post('/', (req, res) => {

  greenmoney.oneTimeDraftRTV(
    req.body.name, req.body.phone, req.body.address1, req.body.city, req.body.state,
    req.body.zip, req.body.routingNumber, req.body.accountNumber, req.body.bankName, req.body.checkAmount
  ).then((e) => {
    console.log("Success:::", e);
    res.status(200).json(e);
  })
  .catch(err => {
    console.error("Form Rejected," + err.message);
    res.status(500).json( {message: err.message});
  });
});




const http = require('http');
const server = http.createServer(app);
let port=process.env.PORT || 4444, host=process.env.host || '127.0.0.1';
server.listen(port, host);
server.on('listening', () => {
  console.log("Open your browser on http://" + host + ":" + port + "/ and enjoy");
  const url = "http://" + host + ":" + port + "/";
  opn(url);
});
server.on('error', (err) => console.error(err) );
