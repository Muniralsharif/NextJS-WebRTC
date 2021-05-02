import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import webRTC from "../../service/webRTC";

export default function Room(props) {
  // const [video, setvideo] = useState([]);

  const router = useRouter();
  const room = router.query.room;
  useEffect(() => {
    if (!room) return;
    webRTC(room);
  }, [room]);

  return <div id={"parent"}></div>;
}
