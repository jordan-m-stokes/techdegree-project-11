'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//route imports
const apiUsersRoute = require('./routes/api/users');
const apiCoursesRoute = require('./routes/api/courses');

// mongodb connection
mongoose.connect('mongodb://localhost:27017/course-api');

//fields
const db = mongoose.connection;
const app = express();

//mongoose connection middleware
db.on('error', console.error.bind(console, 'connection error: '));

db.once("open", () => 
{
    console.log('connection to the database was successful');
});

// set our port
app.set('port', process.env.PORT || 5000);

//third-party middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// route usage
app.use('/api/users', apiUsersRoute);
app.use('/api/courses', apiCoursesRoute);

// send 404 if no other route matched
app.use((request, response) =>
{
	response.status(404).json({
		message: 'Route Not Found'
	});
})

// global error handler
app.use((error, request, response, next) =>
{
	console.error(error.stack);

	response.status(error.status || 500).json({
		message: error.message,
		error: {}
	});
});

// start listening on our port
const server = app.listen(app.get('port'), () =>
{
  	console.log(`Express server is listening on port ${server.address().port}`);
});
