const Campground = require('../models/campground')

/* Show Campgrounds */
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

/* New Campground Form Page */ 
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

/* Create Campground */
module.exports.createCampground = async(req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
    next(e)
}

/* Show a Campground Page */
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews', 
        populate: {
            path: 'author'
        }}).populate('author')
    if(!campground){
        req.flash('error', 'Cannot Find The Campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}

/* Render Edit Campground Form */
module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Cannot Find The Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

/* Update Campground */
module.exports.updateCampground = async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully Updates Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

/* Delete Campground */
module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted The Campground')
    res.redirect('/campgrounds')
}