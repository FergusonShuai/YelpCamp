const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// By default, Mongoose does not include virtuals when you convert a document to JSON.
// So need to set this schema option. 
const opts = { toJSON: { virtuals: true } }; 

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point']
            ,required: true
        },
        coordinates: {
            type: [Number]
            ,required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

// prepare the link for the campground when creating the virtual property
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


// findOneAndDelete is a Mongoose Post middleware. After we deleted the campground, we also delete the associated reviews.
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // doc is the deleted campground containing the review ids that will be passed to 
    // async function after the deletion, so that we can delete reviews.
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);