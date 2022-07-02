const express = require("express");
const app = express();

const http = require('http');
const server = http.createServer(app);

const hbs    = require("hbs");
const path   = require("path");

const {Server} = require("socket.io");
const io = new Server(server);

const redis  = require("redis");
const redisClient = redis.createClient({
    host     : "localhost",
    port     : 6379
});


const { Messages } = require("./models");

let getCache = (key)=>{
  return new Promise((s,r)=>{
    redisClient.get(key,(err,reply)=>{
        if(err){ r(err); return;}
        redisClient.expire(key,600);
        s(reply);
    });
  });
};


let setCache = (k,v)=>{
  return new Promise((s,r) => {
    redisClient.set(k , JSON.stringify(v) , (err,reply) => {
        if(err){ r(err); return;}
        redisClient.expire(k,600);
        s(reply);
    });
  })
};


// Template engine & setting file position
app.engine('html',hbs.__express);
app.set("views" , path.join(__dirname ,"application","views"));
app.use(express.static(path.join(__dirname,"application")));

var context = require("rabbit.js").createContext("amqp://localhost");
var pub = context.socket("PUBLISH");

pub.connect("chat_message");


app.get("/",(q,s)=>{
    s.send("QQ");
});

app.get("/page",async (q,s)=>{
    let no = await getCache("users");
    no = Number(no) +1;
    await setCache("users" , no);
    s.render("testqq.html",{ no });
});


app.get("/old-messages",async (q,s)=>{
    let result = await Messages.getOldMessages();
    s.json({result});
});

io.on("connection",async (socket)=>{

    let v = await getCache("users");
    console.log("a user connected !!!");

    socket.on("chat message",(msg)=>{

        // 單機 broadcasting
        io.emit('end user message',msg);

        // Multi-instance broadcasting 的話, 需用到 pub/sub pattern 
        // 可用 RabbitMQ 走 amqp 方式 , or redis 亦可以
        pub.write(JSON.stringify(msg));
    });


    // socket.on('disconnect', async () => {
    //     let v = await getCache("users");
    //     await setCache("users" , Number(v)-1);
    //   });
});


server.listen(33456,()=>{
    console.log(`Server is running at : localhost:33456`);
});