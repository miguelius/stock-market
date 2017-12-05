var jsonServer = require('json-server');
var db = require('./db');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var validate = require('express-validation');
var validations = require('./validations');
var market = require('./market');
var _ = require('lodash');

var jwtSecret = 'JWT_SECRET';

var Merval = new market.Market();
Merval.registerStock('TEA', 'common', 0, null, 100);
Merval.registerStock('POP', 'common', 8, null, 100);
Merval.registerStock('ALE', 'common', 23, null, 60);
Merval.registerStock('GIN', 'preferred', 8, 2, 100);
Merval.registerStock('JOE', 'common', 13, null, 250);

Merval.getStock('TEA').recordTrade(new Date(), 3, 'sell', 32);
Merval.getStock('TEA').recordTrade(new Date(), 9, 'sell', 32);
Merval.getStock('GIN').recordTrade(new Date(), 10, 'sell', 60);
Merval.getStock('GIN').recordTrade(new Date(), 10, 'sell', 64);
Merval.getStock('GIN').recordTrade(new Date(), 10, 'buy', 68);
Merval.getStock('JOE').recordTrade(new Date(), 100, 'sell', 120);
Merval.getStock('JOE').recordTrade(new Date(), 200, 'sell', 128);
Merval.getStock('JOE').recordTrade(new Date(), 100, 'buy', 136);

var user = {
  email: 'user@example.com',
  password: 'secret'
};

var app = jsonServer.create();

app.use(cors());
app.use(bodyParser.json());
// app.use(expressJwt({secret: jwtSecret}).unless({path: ['/login']}));

app.get('/mervalIndex', function(req, res) {
  res.send({"index": Merval.allShareIndex()});
});

app.get('/stock', function(req, res) {
  // pagination
  let offset = req.query.offset || 0;
  let count = req.query.count || 5;
  let sortBy = req.query.sortBy;
  let q = req.query.q;

  // gets the stocks as a list
  let stocks = _.map(Merval.stocks, s=> s);
  
  if (q) {
    stocks = _.filter(stocks, s => (s.symbol.toLowerCase().indexOf(q.toLowerCase()) != -1));
  }

  if (sortBy) {
    let sortOrder = 1;
    if(sortBy[0] === "-") {
        sortOrder = -1;
        sortBy = sortBy.substr(1);
    }
    stocks = stocks.sort( (a,b) => {
      var result = (a[sortBy] < b[sortBy]) ? -1 : (a[sortBy] > b[sortBy]) ? 1 : 0;
      return result * sortOrder;
    });
  }

  // clones objects
  let items = stocks.slice(offset, offset + count).map( x=> _.clone(x) );

  // computes price and hides trades
  items.forEach( x => { x.price = x.volumeWeightPrice(); delete(x.trades); } )

  res.send({"items": items, "totalCount": stocks.length, "count": Math.min(items.length,count), "offset": offset});
})

app.get('/stock/:id', function(req, res) {
  res.send( Merval.stocks[req.params.id] );
})

app.post('/trade', validate(validations.trade), function(req, res, next) {
  let trade = req.body;
  Merval.getStock(trade.stock).recordTrade(trade.time, trade.quantity, trade.type, trade.price);
  next();
})

app.post('/login', authenticate, function (req, res) {
  var token = jwt.sign({email: user.email}, jwtSecret);
  res.send({token: token, user: user});
});

app.post('/categories', validate(validations.category), function(req, res, next){
  next();
});

app.put('/categories/:id', validate(validations.category), function(req, res, next){
  next();
});

app.post('/posts', validate(validations.post), function(req, res, next){
  next();
});

app.put('/posts/:id', validate(validations.post), function(req, res, next){
  next();
});

app.get('/me', function (req, res) {
  res.send(req.user);
});

app.use(jsonServer.router(db));
app.use(jsonServer.defaults());

app.listen(8081);

function authenticate(req, res, next) {
  var body = req.body;
  console.log(body)
  if (!body.email || !body.password) {
    res.status(400).end('Must provide email and password');
  } else if (body.email !== user.email || body.password !== user.password) {
    res.status(401).end('Email or password incorrect');
  } else {
    next();
  }
}
