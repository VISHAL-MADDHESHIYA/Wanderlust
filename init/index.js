
require("dotenv").config();

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const LOCAL_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ATLAS_URL = process.env.ATLASDB_URL;

const OWNER_ID = "6a9d2a14636b611731e28504";

const initDB = async (dbUrl, dbName) => {
    if (!dbUrl) {
        console.log(`${dbName} URL missing`);
        return;
    }

    const connection = await mongoose.createConnection(dbUrl).asPromise();

    try {
        const ListingModel = connection.model(
            "Listing",
            Listing.schema
        );

        await ListingModel.deleteMany({});

        const listings = initdata.data.map((obj) => ({
            ...obj,
            owner: OWNER_ID,
        }));

        await ListingModel.insertMany(listings);

        console.log(`${dbName}: Data initialized successfully`);
    } finally {
        await connection.close();
    }
};

const start = async () => {
    try {
        await initDB(LOCAL_URL, "Local MongoDB");
        await initDB(ATLAS_URL, "MongoDB Atlas");

        console.log("Both databases initialized!");
    } catch (err) {
        console.error(err);
    }
};

start();