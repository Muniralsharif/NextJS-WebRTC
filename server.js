const express = require("express");
const next = require("next");
const port = process.env.PORT || 3000;
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
const supServer = require("http").Server(server);
const io = require("socket.io")(supServer);
const { v4: uuidV4 } = require("uuid");
const { PeerServer } = require("peer");
console.log({ uuidV4: uuidV4() });
app
  .prepare()
  .then(() => {
    // server.use(express.static(__dirname + "/"));
    server.post("*", (req, res) => {
      return handle(req, res);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    io.on("connection", (socket) => {
      socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);
      });
    });

    const peerServer = PeerServer({ port: 3001, path: "/" });
    peerServer.on("connection", ({ id }) =>
      console.log("client Connected : ", id)
    );
    supServer.listen(port, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
