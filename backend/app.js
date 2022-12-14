const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");

const db = require('./config/db')

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();


app.use(cors());

// app.use(helmet({
//   crossOriginEmbedderPolicy: false,
//   // ...
// }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;
