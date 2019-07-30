const express = require('express');
const router = express.Router();

//models
const User = require('../../models/user');
const Course = require('../../models/course');
const Review = require('../../models/review');

const parseCredentials = require('../../middleware/credentials').parse;

//gets and populates a course if course id is a paramater and stores it in the request
router.param("cId", (request, response, next, id) => 
{
      Course.findById(id)
            .populate('user', 'fullName')
            .populate({
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'fullName'
                }
            })
            .exec((error, course) => 
            {
                if(error)
                {
                    return next(error);
                }
                if(!course) 
                {
                    error = new Error('Not Found');
                    error.status = 404;
                    return next(error);
                }
                request.course = course;
                next();
            });
});

//gets and populates a review if review id is a paramater and stores it in the request
router.param("rId", (request, response, next, id) => 
{
      Review.findById(id)
            .populate('user', 'fullName')
            .exec((error, review) => 
            {
                if(error)
                {
                    return next(error);
                }
                if(!review) 
                {
                    error = new Error('Not Found');
                    error.status = 404;
                    return next(error);
                }
                request.review = review;
                next();
            });
});

//GET finds and returns all course title and _id properties
router.get('/', (request, response, next) => 
{
    Course.find({})
        .select('title')
        .sort({createdAt: -1})
        .exec((error, courses) => 
        {
            if(error)
            {
                error.status = 400;
                return next(error);
            }
            response.json(courses);
        });
});

//GET gets course based on id
router.get('/:cId', (request, response, next) => 
{
    //returns course stored in the request
    response.json(request.course);
});

//POST creates a course based on the body of the request
router.post('/', parseCredentials, (request, response, next) => 
{
    //authenticate the creator of the course as a valid user
    User.authenticate(request.credentials, function (error, user) 
	{
		if(error)
		{
			next(error);
		}
		else
		{
            //sets creator of the course as the user sending the request
            request.body.user = user._id;

            const course = new Course(request.body);

            //saves course
            course.save((error, doc) => 
            {
                if(error)
                { 
                    error.status = 400;
                    return next(error);
                }
                response.status(201);
                response.location('/');
                return response.json();
            });
        }
    });
});

//PUT updates course based on properties in the body
router.put("/:cId", parseCredentials, (request, response, next) => 
{
    //authenticates that the user making the request is a valid user
    User.authenticate(request.credentials, function (error, user) 
	{
		if(error)
		{
			return next(error);
        }

        const course = request.course;

        //verifies the user making the update request is the author of the course
        if(`${user._id}` !== `${course.user._id}`)
        {
            const error = new Error('You don\'t have permission to update this course');
            error.status = 400;
            return next(error);
        }
		else
		{
            //updates course
			request.course.update(request.body, (error, result) => 
            {
                if(error)
                {
                    error.status = 400;
                    return next(error);
                }
                response.status(204);
                return response.json();
            });
		}
    });
});

//POST creates a review based on properties in the body
router.post("/:cId/reviews", parseCredentials, (request, response, next) => 
{
    //verifies the user making the request exists
    User.authenticate(request.credentials, function (error, user) 
	{
		if(error)
		{
			next(error);
		}
		else
		{
            //sets author of review as the user sending the request
            request.body.user = user._id;

            const course = request.course;

            //verifies that the user sending a review isn't the author
            if(`${course.user._id}` === `${user._id}`)
            {
                const error = new Error('user can\'t review their own course');
                error.status = 400;
                return next(error);
            }

            const review = new Review(request.body);

            //saves review
            review.save((error, doc) => 
            {
                if(error)
                { 
                    error.status = 400;
                    return next(error);
                }
                //pushes the new review to be stored in the coresponding course
                course.reviews.push(review._id);

                //saves the course
                course.save((error, doc) => 
                {
                    if(error)
                    { 
                        error.status = 400;
                        return next(error);
                    }
                    response.status(201);
                    response.location('/api/courses/' + course._id);
                    response.json();
                });
            });
		}
    });
});

//GET gets a review based on paramaters
router.get("/:cId/reviews/:rId", (request, response, next) => 
{
    response.json(request.review);
});


module.exports = router;