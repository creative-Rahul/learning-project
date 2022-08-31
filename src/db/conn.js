const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/youtubeRegistration",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("Sucessfully connected to mongodb");
}).catch((err)=>console.log(err));