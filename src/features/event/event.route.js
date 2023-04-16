const express = require("express");
const event = express.Router();
const eventModel = require("./event.schema");
const userModel=require("../user/user.schema")
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");

// Get events that user has joined or requested to join
event.get("/eventcheck",auth ,async(req, res) => {
    try {
        const events = await eventModel.find({ $or: [{ players: req.user.id }, { requests: req.user.id }] })
        .populate('organizer', 'username');
        res.json(events);
        } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        }
    });

// Get events that i organize
event.get("/organize",auth ,async(req, res) => {
  try {
      const events = await eventModel.find({  organizer: req.user.id  }).populate(['requests',"organizer"]);
      if (!event) {
        return res.status(404).json({ msg: "Event not found" });
      }
      res.json(events);
      } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
      }
  });

// Create a new event
event.post("/create", auth, async (req, res) => {
  const { name, description, date, time, maxPlayers ,requirements} = req.body;

  try {
    const event = await eventModel.create({
      name,
      description,
      date,
      time,
      maxPlayers,
      requirements,
      organizer: req.user.id,
    });

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all events
event.get("/all",async (req, res) => {
  try {
    const events = await eventModel.find().populate("organizer", "username");
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get event by ID
event.get("/:id", async (req, res) => {
  try {
    const event = await eventModel
      .findById(req.params.id)
      .populate("organizer", "username");
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.json([event]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Request to join an event with that event id in param
event.post("/:id/join", auth, async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    if (event.players.includes(req.user.id)) {
      return res
        .status(400)
        .json({ msg: "You have already joined this event" });
    }
    else if (event.requests.includes(req.user.id)) {
      return res
        .status(400)
        .json({ msg: "You have already requested to join this event" });
    }
    if (event.players.length >= event.maxPlayers) {
      return res.status(400).json({ msg: "Event is already full" });
    }
    event.requests.push(req.user.id);
    await event.save();
    res.json({ msg: "Request to join event sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({msg:"Server error"});
  }
});

// Organizer accept or reject request to join event id of Event and userId of participant with body as true
event.put("/:id/requests/:userId", auth, async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const index = event.requests.indexOf(req.params.userId);
    if (index === -1) {
      return res.status(404).json({ msg: "Request not found" });
    }
    const accepted = req.body.accepted === "true";
    if (accepted) {
      if (event.players.length >= event.maxPlayers) {
        return res.status(400).json({ msg: "Event is already full" });
      }
      event.players.push(req.params.userId);
      event.accepted.push(req.params.userId)
    }
    event.requests.splice(index, 1);
    event.rejected.push(req.params.userId)
    await event.save();
    res.json({ data:event,msg: accepted ? "Request accepted" : "Request rejected" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get players of an Event ID
event.get("/:id/players", auth, async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    if (event.organizer.toString() !== req.user.id &&!event.players.includes(req.user.id))
    {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const players = await userModel.find({ _id: { $in: event.players } },"username");
    res.json(players);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = event;
