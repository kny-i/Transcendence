import { Grid } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Socket } from "socket.io-client";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import ChannelGroupComponent from "./ChannelGroupComponent";


/**
 * @returns Channel画面のコンポーネント
 */
export default function ChannelComponent() {
  const socket: Socket = useContext(WebsocketContext);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connect: ${socket.id}`);
    })

    return () => {
      console.log(`Disconnect: ${socket.id}`);
      socket.disconnect();
    }
  })


  return (
    <>
      <Grid container>
        <ChannelGroupComponent />
        <Outlet />
      </Grid>
    </>
  )
}
