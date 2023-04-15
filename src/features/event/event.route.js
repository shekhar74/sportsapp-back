const express=require("express");
const event=express.Router();
const eventModel=require("./event.schema")
const auth=require("../../middleware/auth")



module.exports=event