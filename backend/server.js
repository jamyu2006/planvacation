//library imports
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const app = express();
const endpoint = require('./endpoints')
require('dotenv').config()


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
app.use(session({ secret: process.env.TOKEN_SECRET, resave: false, saveUninitialized: false }))
app.use(express.json())
app.use(express.static("assets"));

endpoint.testConnection().catch(console.dir)

//request => 
app.post("/deleteDatabases", async (request, response) => {
  try {
    const {adminkey} = request.body
    endpoint.deleteAllDatabases(adminkey)

    return response.json({ success: true });
  } catch (error) {
    console.error("Error in /deleteDatabases route:", error);
    return response.json({ success: false, message: "Could not create user" });
  }
});

//request => username, email, password
app.post("/createUser", async (request, response) => {
  try {
    const { username, email, password } = request.body;
    const uuid = await endpoint.createUser(username, email, password);

    // Check if the user was successfully created
    if (uuid) {
      request.session.username = username;
      request.session.email = email;
      request.session.uuid = uuid;
      return response.json({ message: uuid, success: true });
    }
    
    return response.json({ success: false });
  } catch (error) {
    console.error("Error in /createUser route:", error);
    return response.json({ success: false, message: "Could not create user" });
  }
});

//request => email, password
app.post("/authenticateUser", async (request, response) => {
  try {
    const { email, password } = request.body;
    const isVerified = await endpoint.authenticateUser(email, password);
    request.session.username = isVerified.username;
    request.session.uuid = isVerified.uuid;
    request.session.email = isVerified.email;
    response.json({success: isVerified.success}); 
  } catch (error) {
    console.error("Error in /authenticateUser:", error);
    response.status(500).json({ success: false, message: "Server error" });
  }
});

//request => uuid, tripname, defaultlocation, defaultaddress, triplocations [] 
app.post("/createTrip", async (request, response) => {
  try {
    const { uuid, tripname, defaultlocation, triplocations} = request.body;
    console.log(tripname);
    console.log(triplocations);

    const createdTrip = await endpoint.createTrip(uuid, tripname, defaultlocation, triplocations)

    if(!createdTrip){
      throw error
    }
    
    return response.json(uuid)
  } catch (error) {
    console.log("could not create trip")
    throw error
  }
})

app.get('/getinfo', (request, response) => {
  return response.json({ user: request.session.username, email: request.session.email, uuid: request.session.uuid});
})

app.get('/logoutuser', (request, response) => {
  request.session.username = null;
  request.session.email = null;
  request.session.uuid = null;
  return response.json({success: true});
})

app.get("/getoldtrips", async (request, response) => {
  const oldtrips = await endpoint.getOldTrips(request.session.uuid);
  return response.json({oldtrips: oldtrips});
})


//allows server to listen on port 3000 on local network ip
app.listen(1111, "0.0.0.0", () => {
  console.log("Running.......")
});


