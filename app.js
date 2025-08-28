const express = require("express");
const app = express();
const mongoose = require("mongoose");


(async()=>{
    try {
        const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
        await mongoose.connect(MONGO_URL);
        console.log("connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
})();

app.listen("8080",()=>{
    console.log("app is listening...--- Express ")
})