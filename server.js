require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port =  3002;

// Middleware and route handling go here
console.log("Before app.listen SASASSAD")
console.log("port: ", port)
// const loginRoute = require('./src/routes/login')
// app.use('/login',loginRoute)

app.use(cors());
// app.get('/api/data', (req, res) => {
//   const data = { message: 'Data from the backend' };
//   res.json(data);
// });
// const loginRoute = require('./src/routes/login')
// app.use('/api',loginRoute)

// const testRoute = require('./src/routes/test')
// app.use('/pages',testRoute)
const logInRoute=require('./src/routes/login')
app.use('/user',logInRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});