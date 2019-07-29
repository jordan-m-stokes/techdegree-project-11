const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: String
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;