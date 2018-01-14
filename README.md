# node-greenmoney

Simple lib to operate with  green.money eCheck API
 
Implemented only oneTimeDraftRTV call cuz it's enough for me currently;

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

```javascript
.
├── demo                   Demo Website powered by express + ejs + bootstrap4 (just one simple form)
├── dist                   Transpiled ES6 to something more usual  
├── docs
│   └── API_eCheck.pdf     Doc from green.money (Exclusive shit!!)
├── index.es.js            Entry point 
├── index.js               Yet another entry point
├── lib
│   ├── GreenMoney.js      A Small -shit- piece of code 
│   └── utils.js           
├── LICENSE                Do whatever the fuck you want. 
├── package.json
├── package-lock.json
└── README.md              This fule 

```
