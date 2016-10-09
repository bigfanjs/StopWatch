'use strict';

const
  path = require('path'),
  express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
  console.log('Listining on port 8080!');
});