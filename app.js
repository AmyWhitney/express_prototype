var express = require('express'),
    cons = require('consolidate'),
    app = express(),
    mustacheRender = require("./lib/mustacheRender").mustacheRender;

// Application settings
app.engine('html', cons.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Middleware to serve static assets
app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/govuk/public'));


app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

// middleware to wrap mustache views in govuk template

app.use(mustacheRender);

//

//var commonHead = '<link href="https://assets.digital.cabinet-office.gov.uk/static/application-f77c1a6a3f7a9f6fa84ac3fb96e466a5.css" rel="stylesheet" type="text/css" />';

var commonHead = '<link href="/public/stylesheets/application.css" rel="stylesheet" type="text/css" />';

// routes

app.get('/', function (req, res) {

  var head = '<link href="https://assets.digital.cabinet-office.gov.uk/static/application-f77c1a6a3f7a9f6fa84ac3fb96e466a5.css" rel="stylesheet" type="text/css" />';

  res.render('index',
            {'pageTitle': 'index',
            'head' : head });
  
});

app.get('/disability-allowance', function (req, res) {
  console.log('disability-allowance');
  console.log(req.session.getting_disability_allowance);
console.log('session : ', req.session);
console.log('query : ', req.query);
  var head = commonHead;

  res.render('disability-allowance',
            {'pageTitle': 'sample',
            'head' : head });
});


app.get('/death-location', function (req, res) {
  
  var head = commonHead;
console.log('req.query : ', req.query);
  console.log('death-location');
  console.log(req.query.getting_disability_allowance);
  req.session.death_location = req.query.death_location;
    console.log('session : ', req.session);
    console.log('query : ', req.query);

  res.render('death-location',
            {'pageTitle': 'sample',
            'head' : head });
});


app.get('/address', function (req, res) {
  
  var head = commonHead;

  console.log('address');
  console.log(req.query.death_location);
  req.session.death_occur = req.query.death_occur;
  
  console.log('session : ', req.session);
  console.log('query : ', req.query);

  res.render('address',
            {'pageTitle': 'sample',
            'head' : head });
});


app.get('/finish', function (req, res) {
  
  var head = commonHead;

  console.log('finish');
  console.log(req.query.address);
  req.session.getting_disability_allowance = req.query.getting_disability_allowance;
    console.log('session : ', req.session);

  res.render('finish',
            {'pageTitle': 'sample',
            'head' : head });
});

app.get('/start', function (req, res) {
  
var head = '<link href="https://assets.digital.cabinet-office.gov.uk/static/application-f77c1a6a3f7a9f6fa84ac3fb96e466a5.css" rel="stylesheet" type="text/css" />';
 
 res.render('start',
              {'pageTitle': 'sample',
              'head' : head });
   
});

app.get('/end', function (req, res) {
  
  var head = '<link href="https://assets.digital.cabinet-office.gov.uk/static/application-f77c1a6a3f7a9f6fa84ac3fb96e466a5.css" rel="stylesheet" type="text/css" />';

  if (req.session.getting_disability_allowance == 'Yes' && req.session.dobdob == 'no'){
    res.render('end-1',
              {'pageTitle': 'sample',
              'head' : head });
  }


  if (req.session.getting_disability_allowance == 'Yes' && req.session.dobdob == 'no'){
    res.render('end-1',
              {'pageTitle': 'sample',
              'head' : head });
  }

});

// start the app

app.listen(3000);
console.log('');
console.log('Listening on port 3000');
console.log('');
