const express = require("express");
const user = express.Router();
const userModel = require("./user.schema");
const auth = require('../../middleware/auth');
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

// Register user
user.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username||!password||!email) {
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
  }


  try {
    // Check if user already exists
    let user = await userModel.findOne({ username });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Create new user
    user = new userModel({ username, password, email });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Save user to database
    await user.save();
    //Response
    res.json({msg:"Register Success" });
  } catch (err) {
    //Error
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//User Login Route

user.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username||!password) {
    return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] }); //Checking input data
  }
  try {
    // Check if user exists
    let user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Matching password
    const Matching = await bcrypt.compare(password, user.password);
    if (!Matching) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }
        // Creating and Sending JWT token here
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });    //24 hour time given 
        res.json({ token:token,msg:"Login Success" });                                    //Response
      } catch (err) {
        //Error
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });

module.exports = user;
