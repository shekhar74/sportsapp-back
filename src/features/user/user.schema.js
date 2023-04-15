const {Schema,model}=require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  email: { type: String, required:true,unique:true,match: /^\S+@\S+\.\S+$/ }//regex for Email verification 
  }, { timestamps: true });

const userModel=model("User",userSchema);

module.exports=userModel;