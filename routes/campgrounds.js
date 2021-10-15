const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/controller_campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
// adding multer middleware to support image uploading
const multer  = require('multer');
const {storage} = require('../cloudinary'); // no need to specify /index.js, as node automatically locates index file.
const upload = multer({storage});

/**********************Campground Model Routing*******************/
router.route('/')
    // Renter campgrounds page (a fancy way of chaining things. Not a big fan of it)
    .get(wrapAsync(campgrounds.index))
    // Creating a new campground
    .post(isLoggedIn, upload.array('images', 5), validateCampground, wrapAsync(campgrounds.createNewCampground));  // images is the name of the file input.

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id', wrapAsync(campgrounds.detailCampground));

// Even though "Starting with Express 5, route handlers and middleware that return a Promise will call next(value) automatically when they reject or throw an error. "
// This will only catch error raised by finById() function, not other errors, like form validation errors.
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

// Updating a campground
router.put('/:id', isLoggedIn, isAuthor, upload.array('images', 5), validateCampground, wrapAsync(campgrounds.updateCampground));

// Deleting a campground
router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;