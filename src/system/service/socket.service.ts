import { Server } from 'socket.io';
import { createServer } from 'http';
import { logger } from '../logging/logger';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });    
    logger.debug('Socket.io initialized');
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
          });
    });
    io.on('error', (error) => {
        console.error('Socket error:', error);
    }
    )

};

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized');
    }
    return io;
};
