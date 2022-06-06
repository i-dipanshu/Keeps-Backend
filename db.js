const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/Keeps";

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('Connected to mongoose succesfully');
    })
}
module.exports = connectToMongo;