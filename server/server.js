require('dotenv').config({ path: '/' });
const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const server = http.createServer(app);
const port  = process.env.port || 80;

mongoose.connect('mongodb://localhost:27017/e-cycling', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }, () => {
  server.listen(port, () => {
    console.log('Server is working');
  });
});