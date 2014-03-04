var express = require('express'),
    cons = require('consolidate'),
    app = express(),
    mustacheRender = require("./lib/mustacheRender").mustacheRender,
    port = (process.env.PORT || 3000);

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

var staticHead = '<link href="https://assets.digital.cabinet-office.gov.uk/static/application-f77c1a6a3f7a9f6fa84ac3fb96e466a5.css" rel="stylesheet" type="text/css" /><link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">';

var commonHead = '<link href="/public/stylesheets/application.css" rel="stylesheet" type="text/css" /><link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">';

// routes

var dataSets = {
  'death_location' : [
    'England or Wales',
    'Scotland',
    'Northern Ireland',
  ],
  'death_occur' : [
    'home_or_hospital',
    'elsewhere' 
  ],
  'expected' : [
    'Yes',
    'No'
  ]
};

var setChecked = function (dataSetName, selectedName, reqData) {
  var results = [],
      dataSet = dataSets[dataSetName],
      i, j;

  for (i = 0, j = dataSet.length; i < j; i++) {
    if ((selectedName !== '') && dataSet[i] === selectedName) {
      reqData['choice_' + (i + 1)] = ' checked="checked"';
    } else {
      reqData['choice_' + (i + 1)] = '';
    }
  }
  return results;
};

function saveRequest(req){
  if(req.query.death_location){
    req.session.death_location = req.query.death_location;
  }
  if(req.query.death_occur){
    req.session.death_occur = req.query.death_occur;
  }
  if(req.query.expected){
    req.session.expected = req.query.expected;
  }
}

app.get('/', function (req, res) {

  var head = staticHead;
  req.session = null; // clear session
  res.render('index',
            {'pageTitle': 'index',
            'head' : head });
  
});

app.get('/death-location', function (req, res) {
  console.log('page /death-location');
  console.log('Initial session : ', req.session);
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/death-occur'
  };
  if (req.session.death_location) {
    setChecked('death_location', req.session.death_location, reqData);
  } else {
    setChecked('death_location', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  res.render('death-location', reqData);
});


app.get('/death-occur', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/expected'
  };
  if (req.session.death_occur) {
    setChecked('death_occur', req.session.death_occur, reqData);
  } else {
    setChecked('death_occur', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /death-occur');
  saveRequest(req);
  
  console.log('session : ', req.session);
  if (req.session.death_location == 'Northern Ireland') {
    res.render('finish5', reqData);
  } else if (req.session.death_location == 'Scotland') {
    res.render('finish4', reqData);
  } else {
    res.render('death-occur', reqData);
  }
});


app.get('/expected', function (req, res) {
  
  var head = commonHead;
  var reqData = {
    'pageTitle': 'sample',
    'head' : head,
    'next' : '/finish'
  };
  if (req.session.expected) {
    setChecked('expected', req.session.expected, reqData);
  } else {
    setChecked('expected', '', reqData);
  }
  if (req.query.edit) {
    reqData.next = '/finish'
  }
  console.log('page /expected');
  saveRequest(req);

  console.log('session : ', req.session); 

  res.render('expected', reqData);
});


// app.get('/finish', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


// app.get('/finish1', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish1');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish1',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


// app.get('/finish2', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish2');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish2',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });

// app.get('/finish3', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish3');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish3',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


// app.get('/finish4', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish4');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish4',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });

// app.get('/finish5', function (req, res) {
  
//   var head = commonHead;

//   console.log('page: /finish5');
//   req.session.expected = req.query.expected;
//   console.log('session : ', req.session);
//   for (param in dataSets) {
//     if (req.query[param]) {
//       req.session[param] = req.query[param];
//     }
//   }

//   res.render('finish5',
//             {
//               'pageTitle': 'sample',
//               'head' : head
//             });
// });


app.get('/start', function (req, res) {
  
var head = staticHead;
 
 res.render('start',
              {'pageTitle': 'sample',
              'head' : head });
   
});

app.get('/finish', function (req, res) {


  console.log('page: /finish');
    saveRequest(req);

  
   console.log('session : ', req.session);
   for (param in dataSets) {
     if (req.query[param]) {
       req.session[param] = req.query[param];
     }
   }

  
  var head = commonHead;

  if (req.session.death_location == 'England or Wales' && 
      req.session.death_occur == 'home_or_hospital' && 
      req.session.expected == 'No'){
    res.render('finish1',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'England or Wales' && 
    req.session.death_occur == 'home_or_hospital' && 
    req.session.expected == 'Yes'){
    res.render('finish',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'England or Wales' && 
      req.session.death_occur == 'elsewhere' && 
      req.session.expected == 'Yes'){
    res.render('finish2',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'England or Wales' && 
      req.session.death_occur == 'elsewhere' && 
      req.session.expected == 'No'){
    res.render('finish3',
              {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'Northern Ireland') {
    res.render('finish5', {'pageTitle': 'sample',
              'head' : head });
  } else if (req.session.death_location == 'Scotland') {
    res.render('finish4', {'pageTitle': 'sample',
              'head' : head });
  } else {
    res.render('fail');
  }

});

// start the app

app.listen(port);
console.log('');
console.log('Listening on port 3000');
console.log('');
