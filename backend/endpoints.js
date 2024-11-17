const uuidv4 = require('uuid').v4
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const databasepassword = process.env.DATABASE_PASSWORD
const adminKey = process.env.ADMIN_KEY

const uri = `mongodb+srv://jamyu2006:${databasepassword}@cluster0.8s53e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    finally {

    }
}

async function deleteCentralDatabase(adminkey) {
    try {
        if (adminkey !== adminKey) {
            console.log("adminkey not valid");
            return;
        }
        await client.db("central_data").dropDatabase();
        console.log("Dropped the central_data database successfully.");
    } 
    catch (error) {
        console.error("Error deleting central_data database:", error);
    } 
    finally {
        await client.close();
    }
}


async function createUser(username, email, password) {
    try {
        const db = client.db("central_data");
        const userCollection = db.collection("users");
        const existingUser = await userCollection.findOne({email:email})
        if (existingUser) {
            return false;
        }
        await userCollection.insertOne({email: email, username: username, password: password, trips: []});
        return true;
    } 
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

async function authenticateUser(email, password) {
    try {
        const db = client.db("central_data");
        const userCollection = db.collection("users");
        const existingUserWithCredentials = await userCollection.findOne({email:email, password:password});
        if (existingUserWithCredentials) {
            return {success: true, username: existingUserWithCredentials.username};
        }
        else {
            return {success: false};
        }
    } 
    catch (error) {
        console.error("Error in authenticateUser:", error);
        return false;
    }
}

async function createTrip(email, tripName, startingLocation, tripLocations) {
    try {
        const db = client.db("central_data");
        const userCollection = db.collection("users");
        const tripDetails = {tripName: tripName, startingLocation: startingLocation, tripLocations: tripLocations}
        await userCollection.updateOne(
            {email: email},
            {$push: {trips: tripDetails}}
        )
        return true;
    } 
    catch (error) {
        console.error("Error in createTrip:", error);
        return false;
    }
}

async function deleteTrip(email, index) {
    try {
        const db = client.db("central_data");
        const userCollection = db.collection("users");
        const userData = await userCollection.findOne({ email: email });
        const updatedTrips = userData.trips.filter((trip, i) => i !== index);
        await userCollection.updateOne(
            {email: email},
            {$set: { trips: updatedTrips}}
        );
        return true;
    }
    catch (error) {
        console.log("Error deleting a trip:", error);
        return false;
    }
}


async function getOldTrips(email) {
    try {
        const db = client.db("central_data");
        const userCollection = db.collection("users");
        const userData = await userCollection.findOne({email:email});
        return userData.trips;
    } 
    catch (error) {
        console.error("Error finding old trips:", error);
        throw error;
    }
}

module.exports = {testConnection, deleteCentralDatabase, createUser, createTrip, authenticateUser, getOldTrips, deleteTrip}