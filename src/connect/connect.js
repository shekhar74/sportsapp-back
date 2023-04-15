const mongoose=require("mongoose");

const connect=async(URL)=>{
   return mongoose.connect(URL)
}

module.exports=connect