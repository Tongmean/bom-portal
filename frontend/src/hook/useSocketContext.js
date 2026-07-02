// SocketContext.js
import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { baseURL } from '../utility/apiClient' 
export const SocketContext = createContext();
const socket = io(baseURL,{ transports: ['websocket']}); // Adjust as needed

export const SocketProvider = ({ children }) => {
    const [lastEvent, setLastEvent] = useState(null); // Store the latest broadcast

    useEffect(() => {
        socket.on('api_broadcast', ({ type, route, data, userEmail, time }) => {
            setLastEvent({ type, route, data, userEmail, time });
        });

        return () => socket.off('api_broadcast');
    }, []);

    return (
        <SocketContext.Provider value={{ lastEvent }}>
            {children}
        </SocketContext.Provider>
    );
};