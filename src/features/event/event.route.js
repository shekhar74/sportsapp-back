const express=require("express");
const event=express.Router();
const eventModel=require("./event.schema")
const auth=require("../../middleware/auth")
const jwt=require("jsonwebtoken");

// Create a new event
event.post('/create', auth,async (req, res) => {
const { name, description, date, time, maxPlayers } = req.body;

try {
// Create new event
const event = new eventModel({ name, description, date, time, maxPlayers, organizer: req.user.id });
// Save event to database
await event.save();

res.json(event);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
    }
    });


module.exports=event