const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
// // Replace with a database
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

router.use(express.json())
// Sample login route with authentication
router.post('/login', async (req, res) => {
  
  const { username, password } = req.body;
console.log("username: ", username)
console.log("Password: ", password)
  // // // Replace this with database lookup
  const user = users.find((user) => user.username === username && user.password===password);
console.log("User: ",user)
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // const passwordMatch = await bcrypt.compare(password, user.password);

  // if (!passwordMatch) {
  //   return res.status(401).json({ message: 'Invalid credentials' });
  // }

  // Authentication successful
  return res.json({ message: 'Login successEEEful' });
});

module.exports = router;