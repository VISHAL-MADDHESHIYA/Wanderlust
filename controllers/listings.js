const Listing = require("../models/listing");

// ================= INDEX =================

module.exports.index = async (req, res) => {
    const { category, search } = req.query;

    let filter = {};

    // Category Filter
    if (category) {
        filter.category = category;
    }

    // Search Filter
    if (search && search.trim() !== "") {
        const searchText = search.trim();

        filter.$or = [
            {
                title: {
                    $regex: searchText,
                    $options: "i"
                }
            },
            {
                location: {
                    $regex: searchText,
                    $options: "i"
                }
            },
            {
                country: {
                    $regex: searchText,
                    $options: "i"
                }
            }
        ];
    }

    const allListings = await Listing.find(filter);

    res.render("listings/index.ejs", {
        allListings,
        selectedCategory: category,
        searchQuery: search
    });
};


// ================= NEW FORM =================

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


// ================= SHOW LISTING =================

module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }

    console.log(listing);

    res.render("listings/show.ejs", {
        listing
    });
};


// ================= CREATE LISTING =================

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;

        newListing.image = {
            url,
            filename
        };
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
};


// ================= EDIT FORM =================

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;

    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/w_250"
    );

    res.render("listings/edit.ejs", {
        listing,
        originalImageUrl
    });
};


// ================= UPDATE LISTING =================

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
        id,
        {
            ...req.body.listing
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;

        listing.image = {
            url,
            filename
        };

        await listing.save();
    }

    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
};


// ================= DELETE LISTING =================

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    const deleteListing = await Listing.findByIdAndDelete(id);

    if (!deleteListing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }

    console.log(deleteListing);

    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
};