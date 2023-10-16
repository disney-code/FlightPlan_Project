require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const port =  3002;
const mongoose = require('mongoose');
const uri = 'mongodb://CharleneTSJ:HappyDay@localhost:27017/mydb';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// const client = new MongoClient(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('connected', () => {
  console.log('Connected to MongoDB');
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.on('disconnected', () => {
  console.log('Mongoose disconnected');
});


process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  });
});




const router = require('./src/routes/userRoutes');

app.use(cors());
app.use('/users',router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});