const express = require('express');
const parseCredentials = require('../../middleware/credentials').parse;

const router = express.Router();

//Models
const User = require('../../models/user')

//GET gets and returns user data based on username and password in header
router.get('/', parseCredentials, (request, response, next) => 
{
	//authenticates user and then returns json
    User.authenticate(request.credentials, function (error, user) 
	{
		if(error)
		{
			next(error);
		}
		else
		{
			return response.json(user);
		}
	});
});

//POST creates a new user based on the info in the body
router.post('/', (request, response, next) => 
{
    const body = request.body;

	//validates the required properties in the body
	if(body.emailAddress 
	&& body.fullName
	&& body.password
	&& body.confirmPassword)
	{
		//checks that password and confirm password match
		if(body.password !== body.confirmPassword)
		{
			const error = new Error('Passwords do not match');
			error.status = 400;
			return next(error);
		}

		const userData = {
			emailAddress: body.emailAddress,
			fullName: body.fullName,
			password: body.password,
		}

		//creates and saves user
		User.create(userData, (error, user) => 
		{
			if(error)
			{
				return next(error);
			}
			else
			{
				response.location('/');
				response.json();
			}
		});
	}
	else
	{
		const error = new Error('All fields required');
		error.status = 400;
		return next(error);
    }
});

module.exports = router;