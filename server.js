import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import socketio from "socket.io";

import "./config/mongo.js";

import WebSockets from "./utils/webSockets.js"

import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";



import { decode } from './middlewares/jwt.js'


const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;


app.use("/", indexRouter);
app.use('/users', userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);


app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doen not exist"
  })
})

const server = http.createServer(app);

global.io = socketio.listen(server);
global.io.on("connection", WebSockets.connection)


server.listen(port)
server.on('listening', () => {
  console.log('Listening on port', port)
});
