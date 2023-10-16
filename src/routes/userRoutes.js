const express = require('express');
const router = express.Router();
const User = require('../../models/userModel')

router.use(express.json())
// Sample login route with authentication
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Username' });
    }

    // Compare the provided password with the one stored in the database
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    // Authentication successful
    return res.json({ message: 'Login successful' });
  } catch (error) {
    console.error("Error in login route:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/signup',async (req,res)=>{
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
})

module.exports = router;