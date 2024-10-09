const mongoose = require('mongoose');

const DB = process.env.MONGODB_URI;

mongoose.connect(DB).then(() => {
    console.log("Connnection Successful");
}).catch((err) => console.log('No Connection ' + err));