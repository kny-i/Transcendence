import { Avatar, Grid, Typography } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import axios from "axios";
import '../../../styles/Chat.css'
import { ChatRoom } from "../../../types/PrismaType";
import LeaveButton from "../utils/LeaveButton";


type ChatFriendsComponentProps = {
  socket: Socket;
  DMRooms: ChatRoom[];
  setDMRooms: any; // useState setter
  isLeave: boolean;
}

/**
 * @returns DirectMessage送信可能なフレンド一覧を表示するコンポーネント
 */
export default function ChatFriendsComponent(props: ChatFriendsComponentProps) {
  const { socket, setDMRooms, DMRooms, isLeave } = props;
  const roomID = useLocation().pathname.split('/')[3];
  const [prevRoomId, setPrevRoomId] = useState<string>();

  const getUserDM = async (): Promise<ChatRoom[]> => {
    try {
      const res = await axios.get(`http://localhost:8080/chat/dm`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  useEffect(() => {
    getUserDM().then((data) => { setDMRooms(data); })
  }, [])

  useEffect(() => {
    socket.on('join_chat_room', () => { });
    socket.on('leave_chat_room', () => { })
  }, [])

  useEffect(() => {
    if (prevRoomId)
      socket.emit('leave_chat_room', { id: prevRoomId });
    socket.emit('join_chat_room', { id: roomID });
    socket.emit('join_chat_room', { id: roomID });
    setPrevRoomId(roomID);
  }, [roomID])

  const handleClick = (roomId: string) => {
    socket.emit('join_chat_room', { id: roomId })
  }

  return (
    <>
      {DMRooms?.map((room, idx) => (
        <Link to={`/chat/room/${room.id}`} onClick={() => handleClick(room.id)} className={'FriendLink'} key={idx}>
          {room.id === roomID ? (
            <Grid
              container height={'7vh'}
              sx={{ display: 'flex', alignItems: 'center' }}
              className={'FriendListActive'}
            >
              <Grid item mr={2} ml={3}>
                <Avatar ><PersonIcon /></Avatar>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  {room.name}
                </Typography>
              </Grid>
              {isLeave ? (
              <Grid item>
                <LeaveButton roomId={room.id} setChannels={setDMRooms} channels={DMRooms} />
              </Grid>
            ) : (<></>)}
            </Grid>
          ) : (
            <Grid
            container height={'7vh'}
            sx={{ display: 'flex', alignItems: 'center' }}
            className={'FriendList'}
            >
              <Grid item mr={2} ml={3}>
                <Avatar ><PersonIcon /></Avatar>
              </Grid>
              <Grid item>
              <Typography variant="subtitle1">
                {room.name}
              </Typography>
              </Grid>
              {isLeave ? (
              <Grid item>
                <LeaveButton roomId={room.id} setChannels={setDMRooms} channels={DMRooms} />
              </Grid>
            ) : (<></>)}
            </Grid>
          )}
        </Link>
      ))}
    </>
  )
}
