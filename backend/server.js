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
app.post("/deleteDatabase", async (request, response) => {
    try {
        const {adminkey} = request.body
        endpoint.deleteCentralDatabase(adminkey)
        return response.json({ success: true });
    } 
    catch (error) {
        console.error("Error in /deleteDatabases route:", error);
        return response.json({ success: false, message: "Could not create user" });
    }
});

//request => username, email, password
app.post("/createUser", async (request, response) => {
    try {
        const { username, email, password } = request.body;
        const userCreated = await endpoint.createUser(username, email, password);

        if (userCreated) {
            request.session.username = username;
            request.session.email = email;
            return response.json({success: true});
        }
        return response.json({success: false});
    } 
    catch (error) {
        console.error("Error in /createUser route:", error);
        throw error;
    }
});

//request => email, password
app.post("/authenticateUser", async (request, response) => {
    try {
        const { email, password } = request.body;
        const isVerified = await endpoint.authenticateUser(email, password);
        request.session.email = email;
        request.session.username = isVerified.username;
        return response.json({success: isVerified.success}); 
    } 
    catch (error) {
        console.error("Error in /authenticateUser:", error);
        response.status(500).json({ success: false, message: "Server error" });
    }
});

//request => tripname, defaultlocation, defaultaddress, triplocations [] 
app.post("/createTrip", async (request, response) => {
    try {
        const {tripName, startingLocation, tripLocations} = request.body;
        const createdTrip = await endpoint.createTrip(request.session.email, tripName, startingLocation, tripLocations)
        if (createdTrip) {
            return response.json(true);
        }
        return response.json(false);
    } 
    catch (error) {
        console.log(error);
    }
})

app.post("/deleteTrip", async (request, response) => {
    try {
        const index = request.body.index;
        const deleted = await endpoint.deleteTrip(request.session.email, index);
        response.json(deleted);
    }
    catch (error){
        console.log(error);
        response.json(false);
    }
})

app.get('/getinfo', (request, response) => {
    return response.json({username: request.session.username, email: request.session.email});
})

app.get('/logoutuser', (request, response) => {
    request.session.username = null;
    request.session.email = null;
    return response.json({success: true});
})

app.get("/getoldtrips", async (request, response) => {
    if (request.session.email == null) {
        return response.json([]);
    }
    const oldtrips = await endpoint.getOldTrips(request.session.email);
    return response.json({oldtrips: oldtrips});
})


//allows server to listen on port 3000 on local network ip
app.listen(1111, "0.0.0.0", () => {
    console.log("Running.......")
});
