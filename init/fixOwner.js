require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

async function fixOwner() {
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB Atlas Connected");

        const ownerId = new mongoose.Types.ObjectId(
            "6aa829d492e48a7723f6dc55"
        );

        const result = await Listing.updateMany(
            {},
            { $set: { owner: ownerId } }
        );

        console.log("Listings Updated:", result.modifiedCount);

    } catch (error) {
        console.log(error);
    } finally {
        await mongoose.connection.close();
    }
}

fixOwner();