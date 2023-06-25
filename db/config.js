 "use strict"
const mongoose=require("mongoose");

const DB="mongodb+srv://jewar0123:Avnish1234@cluster0.gcfs3q4.mongodb.net/preet?retryWrites=true&w=majority"
// console.log(typeof(DB));
// let DB=process.env.database;
mongoose.connect(DB).then(()=>{
        console.log("database connected");
    }).catch((err)=>{
console.log(err);
    })
