import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { io, Socket } from "socket.io-client";
// eslint-disable-next-line no-unused-vars
import ChannelGroupComponent from "./ChannelGroupComponent";
import NewChannelGroupComponent from "./NewChannelGroupComponent";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  const socket: Socket = io('http://localhost:8080/chat')

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connect: ${socket.id}`);
    })

    return () => {
      console.log(`Disconnect: ${socket.id}`);
      socket.disconnect();
    }
  }, [socket])


  return (
    <>
      <Grid container>
        {/* <ChannelGroupComponent socket={socket} /> */}
        <NewChannelGroupComponent socket={socket} />
        <Outlet context={socket}/>
      </Grid>
    </>
  )
}
