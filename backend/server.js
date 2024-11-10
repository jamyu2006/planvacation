//library imports
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uuidv4 = require('uuid').v4

let users = {}

/*
const { getJson } = require("serpapi");

getJson({
  engine: "google_flights",
  hl: "en",
  gl: "us",
  departure_id: "CDG",
  arrival_id: "AUS",
  outbound_date: "2024-11-11",
  return_date: "2024-11-17",
  currency: "USD",
  api_key: "secret_api_key"
}, (json) => {
  console.log(json);
});*/

//middleware
app.use(cors({ origin: ["http://localhost:5173"], methods: ["POST", "GET"], credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }))
app.use(express.json())
app.use(express.static("assets"));

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
testConnection().catch(console.dir)

async function getMovie(int) {
  try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    const query = { title: "The Room" };
    const options = {
      // Sort matched documents in descending order by rating
      sort: { "imdb.rating": -1 },
      // Include only the `title` and `imdb` fields in the returned document
      projection: { _id: 0, title: 1, imdb: 1 },
    };
    // Execute query
    const movie = await movies.findOne(query, options);
    // Print the document returned by findOne()
    console.log(movie, int)
    return movie;
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

async function createUser(username, email, password) {
  try { 
    const existingUser = Object.values(users).find(user => user.email === email);
    if (existingUser) {
      console.log("User with this email already exists.");
      return null;
    }
    
    const uuid = uuidv4()

    users[uuid] = { username, email, password }
    console.log("create user: ",users[uuid])

    const db = client.db(uuid);
    const collection = db.collection('info')

    const result = await collection.insertOne({ username: username, email: email, password:password });

    console.log('created database', uuid);
    console.log('Inserted document with ID:', result.insertedId);
    return uuid;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
//request => username, email, password
app.post("/createUser", async (request, response) => {
  try {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    console.log("received ping", request.body.email)

    const uuid = await createUser(username, email, password)

    console.log("createUser:", uuid)
    return response.json(uuid)
  } catch {
    console.log("could not create user")
  }
})
//request => username, email, password
app.post("/createTrip", async (request, response) => {
  try {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    const uuid = await createUser(username, email, password)

    console.log("createUser:", uuid)
    return response.json(uuid)
  } catch {
    console.log("could not create user")
  }
})

app.post("/authenticateUser", async (request, response) => {
  try {

    console.log("authenticateUser:", request)
  } catch {

  }
})

//allows server to listen on port 3000 on local network ip
app.listen(3000, "0.0.0.0", () => {
  console.log("Running.......")
});


