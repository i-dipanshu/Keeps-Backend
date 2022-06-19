const express = require('express');
const connectToMongo = require('./db');

connectToMongo(); // calling fuction from db.js
const app = express();
const port = 5000;

//middleware
app.use(express.json());

//routes
app.use('/api/auth', require('./routes/auth'));     // for authentication 
app.use('/api/notes', require('./routes/notes'));   // for crud of notes


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})