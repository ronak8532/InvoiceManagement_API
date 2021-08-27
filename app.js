const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/var");
const cors = require("cors");
const {
    db: { host, username, password, name },
} = config;
const bodyParser = require("body-parser");
const handleErrors = require('./middleware/handleErrors');
const { BadRequest } = require('./utils/errors');
const routes = require("./routes/index");
global.__basedir = __dirname;
const app = express();
const moment = require("moment");

console.log(moment().add(5, 'days').format('YYYY-MM-DD'))

mongoose
    .connect(`mongodb+srv://${username}:${password}@${host}/${name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);



app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

app.use((req, res, next) => {
    console.log(req);
    console.log("res", res);
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
app.use(handleErrors);
app.get('/status', function (req, res) {
    return res.status(200).json({ status: 1, type: "Running" });
});
app.use("/api", routes);

module.exports = app;