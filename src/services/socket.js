import React from "react";
import {io} from "socket.io-client";

export const  socket = io("https://wa.harmonylaundrys.com/",{
    withCredentials:true,
    extraHeaders:{
      'my-custom-headers': 'abcd'
    },
    forceNew: true
})

export const SocketContext = React.createContext(socket)