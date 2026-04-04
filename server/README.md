# 3AR Chat Application — Server

The Node.js / Express backend for the 3AR Chat application. It exposes a REST API and a Socket.IO server for real-time communication.

## Features

- **User Authentication** — Secure login and registration with JWT (HTTP-only cookies)
- **Real-time Messaging** — Instant message delivery via Socket.IO
- **Direct Messages** — Private messaging between any two users
- **Channels / Group Chats** — Create and manage group conversations
- **File Sharing** — Upload and download files in conversations
- **User Profiles** — Manage user information and profile pictures
- **Scheduled Cleanup** — Auto-deletes messages older than 60 days every day at 10 AM

## Technology Stack

- **Node.js + Express** — HTTP server and REST API
- **Socket.IO** — Real-time bidirectional communication
- **MongoDB + Mongoose** — Database and ODM
- **JWT (jsonwebtoken)** — Stateless session tokens
- **bcrypt** — Password hashing
- **Multer** — File upload handling
- **node-cron** — Scheduled tasks
- **cookie-parser / cors** — Cookie parsing and CORS support

## Project Structure

```
server/
├── controllers/
│   ├── AuthController.js        # signup, login, profile, password, logout
│   ├── ChannelController.js     # create channel, list channels, get messages
│   ├── ContactsController.js    # search contacts, DM contact list, all users
│   └── MessagesController.js    # DM history, file uploads, message cleanup
├── middlewares/
│   └── AuthMiddleware.js        # JWT cookie verification (verifyToken)
├── models/
│   ├── UserModel.js             # User schema: email, password (hashed), profile
│   ├── ChannelModel.js          # Channel schema: name, admin, members[], messages[]
│   └── MessagesModel.js         # Message schema: sender, recipient, content, fileUrl
├── routes/
│   ├── AuthRoutes.js            # /api/auth/*
│   ├── ChannelRoutes.js         # /api/channel/*
│   ├── ContactRoutes.js         # /api/contacts/*
│   └── MessagesRoutes.js        # /api/messages/*
├── uploads/
│   ├── files/                   # Files shared in conversations
│   └── profiles/                # Profile pictures
├── index.js                     # App bootstrap, middleware, route mounting, DB connection
├── socket.js                    # Socket.IO setup and event handlers
└── package.json
```

## Setup

### Prerequisites
- Node.js v16 or newer
- A running MongoDB instance

### Installation

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in `server/` with:

```env
PORT=3001
DATABASE_URL=mongodb://localhost:27017/3archat
JWT_KEY=your_jwt_secret_here
ORIGIN=http://localhost:5173
# Optional: additional allowed origins for local network access
LAN=http://192.168.x.x:5173
WIFI=http://10.x.x.x:5173
```

### Start the Server

```bash
npm start
```

## API Endpoints

### Authentication — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|:---:|---|
| POST | `/signup` | — | Create a new user account |
| POST | `/login` | — | Authenticate and receive a JWT cookie |
| GET | `/user-info` | ✓ | Get the current user's profile |
| POST | `/update-profile` | ✓ | Update display name and colour |
| POST | `/add-profile-image` | ✓ | Upload a profile picture |
| DELETE | `/delete-profile-image` | ✓ | Remove the current profile picture |
| POST | `/change-password` | ✓ | Change the account password |
| POST | `/logout` | ✓ | Clear the JWT cookie |

### Contacts — `/api/contacts`
| Method | Path | Auth | Description |
|--------|------|:---:|---|
| POST | `/search` | ✓ | Search users by name or email |
| GET | `/get-contacts-for-dm` | ✓ | List DM contacts (from message history) |
| GET | `/get-all-contacts` | ✓ | List all users (for channel creation) |

### Messages — `/api/messages`
| Method | Path | Auth | Description |
|--------|------|:---:|---|
| POST | `/get-messages` | ✓ | Get DM history between two users |
| POST | `/upload-file` | ✓ | Upload an attachment; returns `filePath` |

### Channels — `/api/channel`
| Method | Path | Auth | Description |
|--------|------|:---:|---|
| POST | `/create-channel` | ✓ | Create a channel with a name and member list |
| GET | `/get-user-channels` | ✓ | List channels where the user is a member or admin |
| GET | `/get-channel-messages/:channelId` | ✓ | Get all messages in a channel |

## Socket.IO Events

The client connects with `userId` in the query string so the server can map users to socket IDs.

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `sendMessage` | `{ sender, recipient, content, messageType, fileUrl }` | Send a direct message |
| `send-channel-message` | `{ sender, channelId, content, messageType, fileUrl }` | Broadcast a message to a channel |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `receiveMessage` | Populated `Message` document | Sent to both the sender and the recipient |
| `receive-channel-message` | Populated `Message` doc + `channelId` | Sent to every channel member and the admin |