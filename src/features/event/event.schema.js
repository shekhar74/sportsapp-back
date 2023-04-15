const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    maxPlayers: { type: Number, required: true },
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
