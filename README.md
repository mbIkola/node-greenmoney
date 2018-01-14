# node-greenmoney

Simple lib to operate with  green.money eCheck API 
Implemented only oneTimeDraftRTV call cuz this is enough for me currently;

# Why (Motivation)
```
The best things in life are free
But you can keep 'em for the birds and bees
Your loving give me a thrill,
But your loving don't pay my bills
```

# Whats Inside:
```javascript
 import GreenMoney from 'green-money';
 const config = {
   clientID : process.env.GREEN_CLIENT_ID || 'demo', 
   apiPassword : process.env.API_PASSWORD || 'demodemo'
 };
 const echeckService = new GreenMoney(config.clientID, config.apiPassword);
 
 var app = express(); 
 app.post('/echeck', (req, res) => { 
   try { 
       echeckService.oneTimeDraftRTV(...req.body).then( (response) => {
         res.status( response.Result === 'OK' ? 200 : 500).json(response); 
       }).catch(err => { 
         console.error(
           "Could Not Connect to Green.Money, " +
           "perhaps its a Federal Bank Holiday " +
           "or you are making requests outside of 9:00AM - 5:00PM", err);
         
         res.status('400').json({ message: "Internal Server Pizdetz"});
       }); 
   } catch ( err ) {
     console.debug("Validation Error: ", err);
     res.status(400).json( { message: err.message }); 
   }
 });
```

Transpiled version stored to `./dist`; 
Demo form powered by bootstrap + express/ejs in `./demo`  

