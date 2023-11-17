require('dotenv').config();
const express = require("express");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const uri = process.env.ATLAS_URI;


mongoose.connect(uri);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));

userRoutes.use(bodyParser.json())
adminRoutes.use(bodyParser.json())

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
    console.log(`Server started running at Port ${port}`);
})