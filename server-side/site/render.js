const express  = require('express'),
      cors     = require('cors'),
      marqdown = require('./marqdown.js');

const app = express();

app.configure(() => {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
});

app.get('/healthcheck', (req, res) => {
  res.status(200).end();
});

app.post('/render', (req, res) => {
  const markdown = req.body.markdown;
  console.log(markdown);
  res.send({ preview: marqdown.render(markdown) });
});

app.listen(3003);
