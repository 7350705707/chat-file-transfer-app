import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactsRoutes from './routes/ContactRoutes.js';
import setupSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    
    origin: [process.env.ORIGIN,process.env.LAN,process.env.WIFI],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads/files', express.static('uploads/files'));

app.use(cookieParser());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/channel',channelRoutes)


const server = app.listen(port,'0.0.0.0', () => {
  console.log(`Server running on port http://localhost:${port}`);
});


setupSocket(server);

mongoose.connect(databaseURL).then(() => {  
    console.log('Connected to the database');
}).catch((error) => {
    console.log('Error connecting to the database: ', error);
});

