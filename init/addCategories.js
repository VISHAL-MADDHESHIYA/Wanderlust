require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

const categories = [
    "Trending",
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats"
];

async function addCategories() {
    try {
        await mongoose.connect(dbUrl);

        console.log("MongoDB Atlas Connected");

        const listings = await Listing.find({
            $or: [
                { category: { $exists: false } },
                { category: null }
            ]
        });

        for (let listing of listings) {
            const randomCategory =
                categories[
                    Math.floor(Math.random() * categories.length)
                ];

            listing.category = randomCategory;

            await listing.save();
        }

        console.log(
            "Categories Added:",
            listings.length
        );

    } catch (error) {
        console.log(error);
    } finally {
        await mongoose.connection.close();
    }
}

addCategories();