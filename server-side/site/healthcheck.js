const http = require('http');

// 0 is node, 1 is program name
const service = process.argv[2];

const options = {
  host: 'localhost',
  port: service === 'app' ? 3002 : 3003,
  path: '/healthcheck',
  timeout: 2000
};

const request = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', err => {
  console.log('ERROR');
  process.exit(1);
});

request.end();
