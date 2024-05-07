import { Server } from 'socket.io';
import { createServer } from 'http';
import { logger } from '../logging/logger';
import { MessageModel, ConversationModel } from '../model';

let io;

export const initSocket = httpServer => {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    logger.debug('Socket.io initialized');

    io.on('connection', socket => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('user message to server', async data => {
            try {
                console.log(`${socket.id} : ${data}`);
                io.emit('user message to admin', data);
            } catch (error) {
                console.error('Error handling chat message:', error);
            }
        });

        socket.on('admin message to server', async data => {
            try {
                const { user, message } = data;
                io.emit('admin message to user', data);
            } catch (error) {
                console.error('Error handling chat message:', error);
            }
        });

        socket.on('join conversation', conversationId => {
            console.log('joining conversation:', conversationId);
            socket.join(conversationId);
        });

        // Listen for custom event from clients to log data
        socket.on('logData', data => {
            console.log('Data from client:', data);
        });
    });

    io.on('error', error => {
        console.error('Socket error:', error);
    });
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized');
    }
    return io;
};
