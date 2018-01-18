const express= require('express');
const app = express();
const greenmoney = require('../dist/GreenMoney');

app.use(express.static(__dirname));
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
    } );

});


