const basicAuth = require('basic-auth');

function parse(request, response, next)
{
    const credentials = basicAuth(request);

    if(credentials)
    {
        if(credentials.name && credentials.pass)
        {
            request.credentials = 
            { 
                emailAddress: credentials.name,
                password: credentials.pass
            };
            return next();
        }
    }

    const error = new Error('Please provide email and password');
    error.status = 401;
    next(error);
}

module.exports.parse = parse;