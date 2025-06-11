# 3AR Chat Application

A modern real-time chat application with file transfer capabilities built using MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time communications.

## Project Overview

This project is a full-stack chat application that enables real-time messaging, file sharing, user authentication, and channel management. The application is built with a React frontend and Node.js backend.

## Features

- **User Authentication** - Secure login and registration
- **Real-time Messaging** - Instant message delivery using Socket.IO
- **Direct Messages** - Private messaging between users
- **Channels/Group Chats** - Create and manage group conversations
- **File Sharing** - Upload and download files in conversations
- **User Profiles** - Manage user information and profile pictures
- **Responsive Design** - Works across mobile and desktop devices

## Technology Stack

### Frontend
- React 18.3 with Vite
- Zustand for state management
- TailwindCSS for styling
- Socket.IO client for real-time communication
- Axios for API requests
- Radix UI for component primitives

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- MongoDB for data storage
- JWT for authentication
- Multer for file uploads

## Project Structure

### Client Structure
```
client/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Base UI components
│   ├── context/         # React contexts
│   ├── lib/             # Utility libraries
│   ├── pages/           # Application pages
│   │   ├── auth/        # Authentication pages
│   │   ├── chat/        # Chat interface
│   │   └── profile/     # User profile management
│   ├── store/           # Zustand store
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
└── config files         # Various configuration files
```

### Server Structure
```
server/
├── controllers/         # API route handlers
│   ├── AuthController.js      # Authentication endpoints
│   ├── ChannelController.js   # Channel management
│   ├── ContactsController.js  # Contact management
│   └── MessagesController.js  # Message handling
├── middlewares/         # Express middlewares
│   └── AuthMiddleware.js      # Authentication middleware
├── models/              # Database models
│   ├── ChannelModel.js       # Channel data model
│   ├── MessagesModel.js      # Messages data model
│   └── UserModel.js          # User data model
├── routes/              # API routes
│   ├── AuthRoutes.js         # Authentication routes
│   ├── ChannelRoutes.js      # Channel routes
│   ├── ContactRoutes.js      # Contact routes
│   └── MessagesRoutes.js     # Message routes
├── uploads/             # File uploads
│   ├── files/                # Shared files
│   └── profiles/             # Profile pictures
├── index.js             # Server entry point
├── socket.js            # Socket.IO configuration
└── package.json         # Server dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or newer)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```powershell
   cd server
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/3archat
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```powershell
   npm start
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```powershell
   cd client
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create a `.env` file with:
   ```
   VITE_SERVER_HOST=http://localhost:3001
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user info

### Messages
- `GET /api/messages/:channelId` - Get messages in a channel
- `POST /api/messages/:channelId` - Send a message to a channel
- `POST /api/messages/upload/:channelId` - Upload a file to a channel

### Channels
- `GET /api/channels` - Get all channels for a user
- `POST /api/channels` - Create a new channel
- `GET /api/channels/:channelId` - Get channel details
- `PUT /api/channels/:channelId` - Update a channel
- `DELETE /api/channels/:channelId` - Delete a channel

### Contacts
- `GET /api/contacts` - Get user contacts
- `POST /api/contacts` - Add a contact
- `DELETE /api/contacts/:contactId` - Remove a contact

## Socket.IO Events

- `connection` - User connects
- `disconnect` - User disconnects
- `join-room` - Join a chat room/channel
- `leave-room` - Leave a chat room/channel
- `message` - New message event
- `typing` - User typing indicator
- `stop-typing` - User stopped typing

## License

[MIT License](LICENSE)

## Contact

For any questions or support, please contact the repository maintainers.