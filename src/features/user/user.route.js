const express = require("express");
const user = express.Router();
const userModel = require("./user.schema");
const auth = require('../../middleware/auth');
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

// Register user
user.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

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
   
    // Create and return JWT token
    const payload = { user: { id: user.id } };
    // console.log(user,payload,"user and payload")
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    // console.log(token,"token")
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = user;
