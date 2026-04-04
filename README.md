# 3AR Chat Application

A modern real-time chat application with file transfer capabilities built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time communications.

## Project Overview

3AR Chat is a full-stack chat application that enables real-time messaging, file sharing, user authentication, and channel management. It supports both private one-on-one direct messages and group channels. The frontend is built with React and Vite, while the backend uses Node.js with Express and Socket.IO.

## Features

- **User Authentication** – Secure signup and login with JWT stored in HTTP-only cookies
- **Real-time Messaging** – Instant message delivery using Socket.IO
- **Direct Messages** – Private one-on-one conversations between users
- **Channels / Group Chats** – Create and join group conversations with multiple members
- **File Sharing** – Upload and download files inside conversations, with resumable upload support
- **User Profiles** – Manage display name, avatar color, and profile picture
- **Automatic Cleanup** – A scheduled cron job deletes messages older than 1 day every day at 10 AM
- **Responsive Design** – Works on both mobile and desktop devices

## Technology Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.3 | UI framework |
| Vite | 6.0 | Build tool & dev server (port 3001) |
| React Router | v7 | Client-side routing |
| Zustand | 5.0 | Lightweight state management |
| TailwindCSS | 3.4 | Utility-first CSS styling |
| Socket.IO Client | 4.8 | Real-time communication |
| Axios | 1.7 | HTTP API client |
| Radix UI | – | Accessible component primitives |
| Lucide React / React Icons | – | Icon sets |
| Moment.js | – | Date and time formatting |
| Sonner | – | Toast notifications |
| Lottie | – | Animated illustrations |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| Node.js + Express | 4.21 | Web framework (ES Modules) |
| Socket.IO | 4.8 | Real-time bidirectional communication |
| MongoDB + Mongoose | 8.8 | Database and ODM |
| JSON Web Token | 9.0 | Stateless authentication |
| Bcrypt | 5.1 | Password hashing |
| Multer | 1.4 | File upload handling |
| node-cron | 3.0 | Scheduled tasks (message cleanup) |
| Cookie Parser | – | HTTP cookie middleware |
| CORS | – | Cross-origin resource sharing |
| dotenv | 16.4 | Environment variable loading |

## Project Structure

```
chat-file-transfer-app/
├── client/                         # React frontend
│   ├── public/                     # Static assets
│   └── src/
│       ├── assets/                 # Images and other assets
│       ├── components/
│       │   └── ui/                 # Reusable Radix UI-based components
│       ├── context/
│       │   └── SocketContext.jsx   # Socket.IO connection context
│       ├── lib/                    # Utility helpers (api-client, etc.)
│       ├── pages/
│       │   ├── auth/               # Login and registration pages
│       │   ├── chat/               # Main chat interface
│       │   │   ├── chat-container/         # Message display area
│       │   │   ├── contacts-container/     # DM contacts and channel list
│       │   │   ├── message-bar/            # Message input and send controls
│       │   │   ├── chat-header/            # Active chat info bar
│       │   │   ├── message-container/      # Scrollable message list
│       │   │   ├── empty-chat-container/   # Placeholder when no chat is open
│       │   │   ├── new-dm/                 # Start a new direct message dialog
│       │   │   └── create-channel/         # Create a new channel dialog
│       │   └── profile/            # User profile management
│       ├── store/
│       │   ├── index.js            # Zustand store root
│       │   └── slices/             # auth-slice, chat-slice
│       ├── utils/                  # Constants and helpers
│       ├── App.jsx                 # Root component with routing
│       └── main.jsx                # Application entry point
│
└── server/                         # Node.js backend
    ├── controllers/
    │   ├── AuthController.js       # Signup, login, profile management, logout
    │   ├── ChannelController.js    # Create channels, fetch user channels and messages
    │   ├── ContactsController.js   # Search, list, and manage contacts
    │   └── MessagesController.js   # Fetch messages, file upload, scheduled cleanup
    ├── middlewares/
    │   └── AuthMiddleware.js       # JWT verification (adds userId to req)
    ├── models/
    │   ├── UserModel.js            # User schema (email, name, image, color, profileSetup)
    │   ├── ChannelModel.js         # Channel schema (name, admin, members, messages)
    │   └── MessagesModel.js        # Message schema (sender, recipient, type, content, fileUrl)
    ├── routes/
    │   ├── AuthRoutes.js           # /api/auth/*
    │   ├── ChannelRoutes.js        # /api/channel/*
    │   ├── ContactRoutes.js        # /api/contacts/*
    │   └── MessagesRoutes.js       # /api/messages/*
    ├── uploads/
    │   ├── files/                  # Uploaded files shared in chats
    │   └── profiles/               # User profile pictures
    ├── index.js                    # Server entry point
    ├── socket.js                   # Socket.IO setup and event handlers
    └── package.json                # Server dependencies
```

## Installation & Setup

### Prerequisites
- Node.js v16 or newer
- MongoDB running locally or a remote MongoDB URI
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server/` directory:
   ```env
   PORT=8747
   DATABASE_URL=mongodb://127.0.0.1:27017/3ar-chat-app
   JWT_KEY=your_jwt_secret_here
   ORIGIN=http://localhost:3001
   LAN=http://<your-lan-ip>:3001
   WIFI=http://<your-wifi-ip>:3001
   ```

4. Start the server:
   ```bash
   npm start          # production
   npm run dev        # development (nodemon auto-reload)
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `client/` directory:
   ```env
   VITE_SERVER_HOST=http://localhost:8747
   ```

4. Start the development server:
   ```bash
   npm run dev        # dev server on port 3001
   npm run build      # production build
   npm run preview    # preview production build
   ```

### Accessing the Application
- **Frontend**: `http://localhost:3001`
- **Backend API**: `http://localhost:8747`

## API Endpoints

All authenticated routes require a valid JWT cookie set during login.

### Authentication — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signup` | No | Register a new user |
| POST | `/login` | No | Login and receive JWT cookie |
| GET | `/user-info` | Yes | Get current user's info |
| POST | `/update-profile` | Yes | Update display name and color |
| POST | `/add-profile-image` | Yes | Upload a profile picture |
| DELETE | `/delete-profile-image` | Yes | Remove profile picture |
| POST | `/change-password` | Yes | Change account password |
| POST | `/logout` | Yes | Clear JWT cookie and logout |

### Messages — `/api/messages`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/get-messages` | Yes | Fetch messages between current user and another user |
| POST | `/upload-file` | Yes | Upload a file to be shared in a conversation |

### Channels — `/api/channel`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/create-channel` | Yes | Create a new group channel |
| GET | `/get-user-channels` | Yes | Get all channels the current user belongs to |
| GET | `/get-channel-messages/:channelId` | Yes | Get all messages in a channel |

### Contacts — `/api/contacts`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/search` | Yes | Search users by name or email |
| GET | `/get-contacts-for-dm` | Yes | Get contacts with existing DM conversations |
| GET | `/get-all-contacts` | Yes | Get all users for channel member selection |

### Static Files
- `GET /uploads/profiles/<filename>` – Serve profile pictures
- `GET /uploads/files/<filename>` – Serve shared files

## Socket.IO Events

The server maintains a `userSocketMap` that maps each `userId` to their active socket ID, enabling targeted real-time delivery.

Connect with `userId` as a query parameter:
```js
io.connect(SERVER_URL, { query: { userId: "..." } });
```

| Event | Direction | Description |
|-------|-----------|-------------|
| `sendMessage` | Client → Server | Send a direct message to another user |
| `receiveMessage` | Server → Client | Deliver a direct message to sender and recipient |
| `send-channel-message` | Client → Server | Send a message to a group channel |
| `receive-channel-message` | Server → Client | Broadcast a channel message to all channel members and admin |
| `disconnect` | Client → Server | Remove user from the socket map on disconnection |

## State Management (Zustand)

The frontend uses two Zustand store slices:

**auth-slice**
- `userInfo` – Currently authenticated user object

**chat-slice**
- `selectedChatType` – `"direct"` or `"channel"`
- `selectedChatData` – Active conversation or channel data
- `selectedChatMessages` – Messages in the active conversation
- `directMessagesContacts` – List of DM contacts
- `channels` – User's group channels
- `isUploading` / `isDownloading` – File transfer state flags
- `fileUploadProgress` / `fileDownloadProgress` – Transfer progress percentages

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact the repository maintainers.