const express = require("express");
const http = require("http");
const cors = require("cors");

require('./db/config.js');
const Product=require('./db/Product.js');
const socketIO = require("socket.io");
const app = express();
const users=[{}];
app.use(cors());
app.use(express.json());

// ..............user register API start..........?
app.post("/register", async (req, resp)=>{
const user= new Product(req.body);
const result=await user.save();
resp.send(result);
})
// ..............user register API end..........?
// ..................Login Api code start here.................?
app.post('/login', async(req, resp)=>{
  console.log(req.body);
  if (req.body.password && req.body.email) {
      const data = await Product.findOne(req.body).select("-password");
      if (data) {
          resp.send(data);
          console.log(data);

      } else {
          resp.send({ Result: "Result not found" });
      }

  } else {
      resp.send({ result: "Record is missing" })
  }

})
// ..................Login Api code end here.................?


app.get("/", (req, resp) => {
  console.log("app is working here ");
  resp.send("<h1>app is working here</h1>");
});

const port = 4500 || process.env.PORT;

const server = http.createServer(app);

const io = socketIO(server);
io.on("connection", (socket) => {
  console.log("new connection");

  socket.on('joined', ({user})=>{
    users[socket.id]=user;
    console.log(`${user} is joined`)
    socket.broadcast.emit("userjoined", {user:"admin", message:` ${users[socket.id]} has joined`});
    socket.emit('welcome', {user:"admin", message:`welcome to  ${users[socket.id]}`})
  })
  // socket.emit('welcome', {user:"admin", message:"welcome to chat"})
  // socket.broadcast.emit("userjoined", {user:"admin", message:` ${users[socket.id]} has joined`});
  socket.on('message', ({message, id})=>{
    io.emit('sendMessage', {user:users[id], message, id})

  })
  socket.on('desconnect', ()=>{
    socket.broadcast.emit('leave', {user:"admin", message:`${users[socket.id]}user has left`})
    console.log("User left");
  })
 
});

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
