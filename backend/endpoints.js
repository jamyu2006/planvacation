const uuidv4 = require('uuid').v4
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

let users = {}

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

async function deleteAllDatabases(adminkey) {
    try {

        if(adminkey !== adminKey){
            console.log("adminkey not valid")
            return
        }
        // List all databases
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();

        // Loop through each database and drop it
        for (const database of databases.databases) {
            const dbName = database.name;

            // Skip system databases if needed
            if (!['admin', 'config', 'local'].includes(dbName)) {
                await client.db(dbName).dropDatabase();
                console.log(`Dropped database: ${dbName}`);
            }
        }

        console.log("All databases deleted successfully.");
    } catch (error) {
        console.error("Error deleting databases:", error);
    } finally {
        await client.close();
    }
}

async function createUser(username, email, password) {
    try {
        // Check if the user already exists by email
        const existingUser = Object.values(users).find(user => user.email === email);
        if (existingUser) {
            console.log("User with this email already exists.");
            return null;
        }

        const uuid = uuidv4()

        users[uuid] = { username, email, password }
        console.log("create user: ", users[uuid])

        const db = client.db(uuid);
        const collection = db.collection('info')

        const result = await collection.insertOne({ username: username, email: email, password: password });
        console.log('created database', uuid);
        console.log('Inserted document with ID:', result.insertedId);

        return uuid;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

async function authenticateUser(email, password) {
    try {
        const userExists = await (async () => {
            for (const uuid of Object.keys(users)) {
                if (users[uuid].email === email) {
                    const db = client.db(uuid);
                    const collection = db.collection('info');

                    const dbUser = await collection.findOne({ email: email });
                    console.log("Found password in database: ", dbUser.password, password);

                    if (password === dbUser.password) {
                        return {success: true, username: dbUser.username, email: dbUser.email, uuid: uuid};
                    }
                }
            }
            return {success: false};
        })();

        return userExists;  // Return true if user is authenticated, otherwise false
    } catch (error) {
        console.error("Error in authenticateUser:", error);
        return false;  // Return false if an error occurs during the authentication process
    }
}

async function createTrip(uuid, tripname, defaultlocation, triplocations) {
    try {
        const db = client.db(uuid);
        const collection = db.collection(tripname);

        const result = await collection.insertOne({ locationname: defaultlocation.name, address: defaultlocation.address });
        console.log('Inserted document with ID:', result.insertedId);
        
        await Promise.all(triplocations.map(async (location) => {
            const locationResult = await collection.insertOne({
                locationname: location.name,
                address: location.address
            });
            console.log('Inserted additional location with ID:', locationResult.insertedId);
        }));

        return true;
    } catch (error) {
        console.error("Error in createTrip:", error);
        return false;
    }
}


async function getOldTrips(uuid) {
    try {
        const db = client.db(uuid);
        const collections = await db.listCollections().toArray();
        const trips = collections.filter(collection => collection.name != "info");
        console.log("here are the trips: " + trips);
        return trips;
    } catch (error) {
        console.error("Error finding old trips:", error);
        return [];
    }
}

module.exports = {testConnection, deleteAllDatabases, createUser, createTrip, authenticateUser, getOldTrips}