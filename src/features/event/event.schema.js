const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }, //yyyy-mm-dd
    time: { type: String, required: true }, //moment.js time hh:mm:ss
    maxPlayers: { type: Number, required: true },
    requirements:{type:String,default:"Appropriate Sports Dress"},
    players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    organizer: { type: Schema.Types.ObjectId, ref: 'User' },
    requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    accepted: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rejected: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const eventModel = model("event", eventSchema);

module.exports = eventModel;
