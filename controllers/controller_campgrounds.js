const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'New Campground Created!');
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.detailCampground = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'  // populate the author for each review
        }}).populate('author');  // populate the author for each campground
    if (!camp) {
        req.flash('error', "Can't find the campground.");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/detail', {camp});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', "Can't find the campground.");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    updatedCamp.images.push(...imgs);
    await updatedCamp.save();
    // console.log(updatedCamp._id);
    req.flash('success', 'Campground Updated Successfully!');
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted.');
    res.redirect('/campgrounds');
}