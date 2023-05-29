const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const logger = require('morgan');
const path = require('path');

app.use(logger('dev'));
app.use(express.json());

app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/admin', require('./routes/adminRoute'));
app.use('/api/v1/doctor', require('./routes/doctorRoute'));

// static files

app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

dotenv.config();

connectDb();


app.listen(5000, () => {
    // console.log("Server Successfully created");
})





