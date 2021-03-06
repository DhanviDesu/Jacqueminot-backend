const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

//start server with port 5000
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use('/uploads', express.static('uploads'))
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const fullUserRouter = require('./routes/fullUser');
const usersRouter = require('./routes/users');

app.use('/fullUser', fullUserRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
