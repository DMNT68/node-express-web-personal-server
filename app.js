const express = require('express');
const bodyParser = require('body-parser');
const { API_VERSION } = require('./config');

const app = express();

// Routing
const userRoutes = require('./routers/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure header http
// ...

// router basic
app.use(`/api/${API_VERSION}`, userRoutes);

module.exports = app;
