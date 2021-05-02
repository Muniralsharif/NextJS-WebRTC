import { io } from "socket.io-client";

let peer, socket;
const peers = {};

const webRTC = (room) => {
  socket = io("/");
  peer = new Peer(undefined, {
    host: "/",
    port: "3001",
  });
  peer.on("open", (id) => {
    socket.emit("join-room", room, id);
  });
  broadcastSelf();
};

const broadcastSelf = () => {
  const video = video;
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      const video = document.createElement("video");
      video.muted = true;

      createVideo(video, stream);
      peer.on("call", (call) => {
        call.answer(stream);
      });

      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
    });
};

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    createVideo(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
};

const createVideo = (video, stream) => {
  console.log({ stream });
  const el = document.getElementById("parent");
  video.srcObject = stream;
  //   video.style.backgroundColor = "red";
  video.style.width = "100px";
  video.style.height = "100px";
  video.style.objectFit = "cover";
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  el.append(video);
};

export default webRTC;
