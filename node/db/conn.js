const mongoose = require("mongoose");
require("dotenv").config();

const DB = process.env.DATABASE
console.log(DB)
mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=> console.log("DataBase Connected")).catch((err)=>{
    console.log(err);
})