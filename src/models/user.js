const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});


//authenticates user making a request is in the database
UserSchema.statics.authenticate = function(credentials, callback) 
{
    //searches for user based on email provided
    User.findOne({ emailAddress: credentials.emailAddress })
        .exec((error, user) => 
        {
            if(error)
            {
                return callback(error);
            }
            else if(!user)
            {
                const error = new Error('User not found');
                error.status = 401;
                return callback(error);
            }
            //if there is no error and user exists, the encrypted password provided is verified
            bcrypt.compare(credentials.password, user.password, (error, result) =>
            {
                if(error || !user)
                {
                    const error = new Error('Wrong email or password');
                    error.status = 401;
                    callback(error, null);
                }
                //if password is a match, the callback is called passing the corresponding user within
                else
                {
                    return callback(null, user);
                }
            });
        });
};

//before a new user is saved, the password will be encrypted
UserSchema.pre('save', function(next) 
{
    bcrypt.hash(this.password, 10, (error, hash) =>
    {
        if(error)
        {
            return next(error);
        }
        this.password = hash;
        next();
    });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;