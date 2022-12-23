const functions = require("firebase-functions");

const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const routes = require("../routes/index");

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
const PORT = process.env.PORT || 8080;
mongoose
  .connect(
    "mongodb+srv://ronak3445:Mahadev123@cluster0.0bty0.mongodb.net/InvoiceManagement",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to database!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// simple route
app.get("/", (req, res) => {
  res.json({message: "Welcome to invoice application."});
});

app.use("/", routes);

exports.app = functions.https.onRequest(app);
