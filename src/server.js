require('dotenv').config();
const express=require("express");
const cors=require("cors");
const app=express();
const connect=require("./connect/connect")

// imported Routes
const users=require("./features/user/user.route")
const event=require("./features/event/event.route")

app.use(express.json());
app.use(cors({origin:"*"}))

//Routes used here
app.use("/user",users)
app.use("/event",event)


//Homepage
app.get("/",(req,res)=>{
    res.send("Homepage for Sports App server")
})

//server listen
app.listen(process.env.PORT,async()=>{
    await connect(process.env.MONGODB_URL);
    console.log(`listening at ${process.env.PORT}`)
})