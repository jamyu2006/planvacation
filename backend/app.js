//library imports
const express = require("express")
const cors = require("cors")
const session = require("express-session")
const sql = require("mysql2");
const app = express();

//middleware
app.use(cors({ origin: ["http://localhost:5173"], methods: ["POST", "GET"], credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }))
app.use(express.json())
app.use(express.static("assets"));




//allows server to listen on port 1111 on local network ip
app.listen(1111, "0.0.0.0", () => {
    console.log("Running.......")
});


