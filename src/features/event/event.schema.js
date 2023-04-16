const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, //dd-mm-yyyy
    time: { type: String, required: true }, //hh:mm
    started: {
      type: String,
      enum: ['true', 'false'],
      default: 'false',
    },
    maxPlayers: { type: Number, required: true },
    requirements:{type:String,default:"Appropriate Sports Dress"},
    players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    organizer: { type: Schema.Types.ObjectId, ref: 'User',required:true },
    requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    accepted: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rejected: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

const eventModel = model("event", eventSchema);

module.exports = eventModel;
