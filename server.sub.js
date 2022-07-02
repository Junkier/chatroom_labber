const express = require("express");
const { Messages } = require("./models");
const app = express();

var context = require('rabbit.js').createContext('amqp://localhost');
var sub = context.socket("SUBSCRIBE");


// 設定 exchange
sub.connect("chat_message");
sub.setEncoding("utf8");

sub.on("data",async (note)=>{
    note = JSON.parse(note);
    await Messages.insertOneMsg(note);
})


app.listen(12333,()=>{
    console.log(`Server is running at : localhost:12333`);
});