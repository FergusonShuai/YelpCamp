const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/controller_reviews');
const { isLoggedIn, validateCampground, isAuthor, isReviewAuthor, validateReview } = require('../middleware');

router.post('/:id/reviews', isLoggedIn, validateReview, wrapAsync(reviews.postReview));

router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;