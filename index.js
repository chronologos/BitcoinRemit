"use strict";
var dotenv = require('dotenv');
dotenv.load();

// COINBASE API ACCESS
var Client = require('coinbase').Client;
var client = new Client({
  'apiKey': process.env.API_ID,
  'apiSecret': process.env.API_SECRET,
  'baseApiUri': 'https://api.sandbox.coinbase.com/v2/',
  'tokenUri': 'https://api.sandbox.coinbase.com/oauth/token'
});

// EXPRESS CONFIG
var express = require('express');
var app = express();
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

// ROUTES
app.get('/', function(req, res) {
  res.render('index.jade');
});

app.get('/api/getAccounts', function(req, res) {
  var accountData = [];
  client.getAccounts({}, function(err, accounts) {
    var thisAcct;
    accounts.forEach(function(acct) {
      thisAcct = {};
      thisAcct = {
        name: acct.name,
        balance: acct.balance.amount,
        currency: acct.balance.currency,
        transactions: []
      };
      acct.getTransactions(null, function(err, txns) {
        txns.forEach(function(txn) {
          thisAcct.transactions.push(txn.id);
          accountData.push(thisAcct);

          // console.log(txn.id);
          // console.log(thisAcct);
          // console.log(thisAcct.transactions);
          console.log(accountData);

        });
        res.json(accountData);
      });
    });
  });

});

app.post('/api/remit',
  function(req, res) {
    console.log(req.body);
    res.json(req.body);
  }
);
app.listen(3000);
