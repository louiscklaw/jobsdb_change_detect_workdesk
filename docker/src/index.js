// express app
const express = require('express');
const bodyParser = require('body-parser');
const sem = require('semaphore')(1);

global.sem = sem;

// load env vars
require('dotenv').config();

// load logger and report functions
const { myLogger } = require('./utils/myLogger');

// create express app
const app = express();
app.use(bodyParser.json());

// try to load all routes
try {
  //
  // //
  // app.use('/carousell_search_by_keyword', require('./routes/carousell_search_by_keyword'));
  // app.use('/carousell_user_listing', require('./routes/carousell_user_listing'));
  app.use('/jobsdb_fetch_list', require('./routes/jobsdb_fetch_list'));
  app.use('/jobsdb_fetch_job_detail', require('./routes/jobsdb_fetch_job_detail'));
  // //
  app.use('/healthcheck', require('./routes/healthcheck'));
  app.use('/start_chrome', require('./routes/start_chrome'));
  // app.use('/start_firefox', require('./routes/start_firefox'));
  app.use('/helloworld', require('./routes/helloworld'));
  app.use('/hello', require('./routes/hello'));
  // start the server
  app.listen(3000, '0.0.0.0', () => {
    myLogger.info('Server is running on port 3000');
  });
} catch (error) {
  //   // log and report if there's an error
  myLogger.error(JSON.stringify(error));
}
