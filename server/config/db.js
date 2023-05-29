const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect(process.env.MONGODB_URL).then((db) => {
        // console.log('database successfully connected');
    }).catch((err) => {
        console.log(err.message);
    })
}

module.exports = connectDb;