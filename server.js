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



// Middleware and route handling go here

// const loginRoute = require('./src/routes/login')
// app.use('/login',loginRoute)

app.use(cors());

const userSchema = new mongoose.Schema({
  username: {type:String, unique:true},
  email: {type:String, unique:true},
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/submit-form', async (req, res) => {
  const formData = req.body; // Assuming you're sending data in the request body

  const existingUser = await User.findOne({
    $or: [{ username: formData.username }, { email: formData.email }],
  });

  if(existingUser){
    return res.status(400).json({message:"Username or email already in use"})
  }
  
  const newUser = new User(formData);
  
  newUser.save()
    .then(() => {
      res.status(201).json({ message: 'User registered successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error saving user data', error });
    });
});



const logInRoute=require('./src/routes/login')
app.use('/user',logInRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});