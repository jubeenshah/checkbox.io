var express = require('express'),
        cors = require('cors'),
	marqdown = require('./marqdown.js'),
	//routes = require('./routes/designer.js'),
	//votes = require('./routes/live.js'),
	//upload = require('./routes/upload.js'),
	create = require('./routes/create.js'),
	study = require('./routes/study.js'),
	admin = require('./routes/admin.js');
        got = require('got');
	child_process = require('child_process')

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});


var whitelist = ['http://chrisparnin.me', 'http://pythontutor.com', 'http://happyface.io', 'http://happyface.io:8003', 'http://happyface.io/hf.html'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};

// healthcheck
app.get('/healthcheck', (req, res) => {
  res.status(200).end();
});

app.options('/api/study/vote/submit/', cors(corsOptions));

app.post('/api/design/survey',
	async function(req,res)
	{
	try {
    const markdown = req.body.markdown
		console.log(markdown);
    const response = await got.post(`http://render-service/render`, {
      body: {
        markdown: markdown
      },
      json: true,
      timeout: 500
    });
		res.send({ preview: response.body.preview });
	}
	catch (e) {
		console.log("Error: "+ e);	
	}
	
	}
);
//app.get('/api/design/survey/all', routes.findAll );
//app.get('/api/design/survey/:id', routes.findById );
//app.get('/api/design/survey/admin/:token', routes.findByToken );

//app.post('/api/design/survey/save', routes.saveSurvey );
//app.post('/api/design/survey/open/', routes.openSurvey );
//app.post('/api/design/survey/close/', routes.closeSurvey );
//app.post('/api/design/survey/notify/', routes.notifyParticipant );


//// ################################
//// Towards general study management.
app.get('/api/study/load/:id', study.loadStudy );
app.get('/api/study/vote/status', study.voteStatus );
app.get('/api/study/status/:id', study.status );

app.get('/api/study/listing', study.listing );

app.post('/api/study/create', create.createStudy );
app.post('/api/study/vote/submit/', cors(corsOptions), study.submitVote );

//// ADMIN ROUTES
app.get('/api/study/admin/:token', admin.loadStudy );
app.get('/api/study/admin/download/:token', admin.download );
app.get('/api/study/admin/assign/:token', admin.assignWinner);

app.post('/api/study/admin/open/', admin.openStudy );
app.post('/api/study/admin/close/', admin.closeStudy );
app.post('/api/study/admin/notify/', admin.notifyParticipant);

//// ################################

//app.post('/api/upload', upload.uploadFile );

// survey listing for studies.
//app.get('/api/design/survey/all/listing', routes.studyListing );

// Download
//app.get('/api/design/survey/vote/download/:token', votes.download );
// Winner
//app.get('/api/design/survey/winner/:token', votes.pickParticipant );

// Voting
//app.get('/api/design/survey/vote/all', votes.findAll );
//app.post('/api/design/survey/vote/cast', votes.castVote );
//app.get('/api/design/survey/vote/status', votes.status );
//app.get('/api/design/survey/vote/stat/:id', votes.getSurveyStats );



app.listen(3002);
console.log(`Listening on port 3002...`);
