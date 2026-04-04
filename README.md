# 3AR Chat Application

A modern real-time chat and file-transfer application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## Project Overview

3AR Chat is a full-stack application that lets users send direct messages, create group channels, share files, and manage their profiles — all in real time. The React frontend communicates with the Node.js/Express backend over both a REST API (Axios) and a persistent Socket.IO connection.

## Features

- **User Authentication** — Secure login with JWT stored in HTTP-only cookies
- **Profile Management** — Upload/remove a profile picture, set a display name and colour theme, change password
- **Real-time Direct Messaging** — Instant private messages between any two users via Socket.IO
- **Channels / Group Chats** — Create named channels, add members, and broadcast messages to all participants
- **File Sharing** — Attach and send files (images or arbitrary files) in any conversation, with upload-progress tracking
- **Responsive Design** — Usable on both mobile and desktop browsers
- **Automatic Cleanup** — A server-side cron job deletes messages older than 60 days every day at 10 AM

## Technology Stack

### Frontend (`client/`)
| Technology | Purpose |
|---|---|
| React 18.3 + Vite | UI library and build tool |
| Zustand | Global state management (auth + chat slices) |
| Socket.IO Client | Real-time bidirectional communication |
| Axios | HTTP REST requests |
| TailwindCSS | Utility-first styling |
| Radix UI / shadcn-ui | Accessible UI component primitives |
| React Router | Client-side routing |
| Moment.js | Date/time formatting |
| emoji-picker-react | Emoji picker in the message bar |

### Backend (`server/`)
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server and REST API |
| Socket.IO | Real-time messaging layer |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Stateless session authentication |
| bcrypt | Password hashing |
| Multer | File upload handling |
| node-cron | Scheduled message cleanup |
| cookie-parser / cors | Cookie and CORS support |

## Project Structure

```
chat-file-transfer-app/
├── client/                          # React / Vite frontend
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                 # Application entry point
│       ├── App.jsx                  # Root router (auth guard)
│       ├── assets/                  # Images and Lottie animations
│       ├── components/ui/           # Reusable Radix-based UI primitives
│       ├── context/
│       │   └── SocketContext.jsx    # Socket.IO context provider
│       ├── lib/
│       │   ├── api-client.js        # Configured Axios instance
│       │   └── utils.js             # Helper functions (e.g. cn, colour map)
│       ├── store/
│       │   ├── index.js             # Zustand store
│       │   └── slices/
│       │       ├── auth-slice.js    # userInfo state
│       │       └── chat-slice.js    # chat/channel/message state
│       ├── utils/constants.js       # API route constants
│       └── pages/
│           ├── auth/index.jsx       # Login / signup page
│           ├── profile/index.jsx    # Profile management
│           └── chat/
│               ├── index.jsx        # Main chat layout
│               └── components/
│                   ├── contacts-container/   # Left sidebar (DMs + channels)
│                   ├── chat-container/       # Chat header, messages, input bar
│                   └── empty-chat-container/ # Placeholder when no chat selected
│
└── server/                          # Node.js / Express backend
    ├── index.js                     # Express app + server startup + MongoDB connection
    ├── socket.js                    # Socket.IO event handlers
    ├── controllers/
    │   ├── AuthController.js        # Auth logic (signup, login, profile, password)
    │   ├── ChannelController.js     # Channel CRUD and message retrieval
    │   ├── ContactsController.js    # Contact search and DM contact list
    │   └── MessagesController.js    # DM history and file uploads
    ├── middlewares/
    │   └── AuthMiddleware.js        # JWT cookie verification
    ├── models/
    │   ├── UserModel.js             # User schema (email, password hash, profile)
    │   ├── ChannelModel.js          # Channel schema (name, members, admin, messages)
    │   └── MessagesModel.js         # Message schema (sender, recipient, content, fileUrl)
    ├── routes/
    │   ├── AuthRoutes.js
    │   ├── ChannelRoutes.js
    │   ├── ContactRoutes.js
    │   └── MessagesRoutes.js
    └── uploads/
        ├── profiles/                # Stored profile images
        └── files/                   # Files shared in conversations
```

## Installation & Setup

### Prerequisites
- Node.js v16 or newer
- A running MongoDB instance (local or Atlas)
- npm

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `server/` with the following variables:
   ```env
   PORT=3001
   DATABASE_URL=mongodb://localhost:27017/3archat
   JWT_KEY=your_jwt_secret_here
   ORIGIN=http://localhost:5173
   # Optional: LAN and WiFi origins for local network access
   LAN=http://192.168.x.x:5173
   WIFI=http://10.x.x.x:5173
   ```

4. Start the server:
   ```bash
   npm start
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

3. Create a `.env` file in `client/` with:
   ```env
   VITE_SERVER_HOST=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## API Endpoints

All endpoints are prefixed with the base URL configured in `VITE_SERVER_HOST`.

### Authentication — `/api/auth`
| Method | Path | Auth required | Description |
|--------|------|:---:|---|
| POST | `/signup` | — | Create a new user account |
| POST | `/login` | — | Authenticate and receive a JWT cookie |
| GET | `/user-info` | ✓ | Get the current user's profile |
| POST | `/update-profile` | ✓ | Update display name and colour |
| POST | `/add-profile-image` | ✓ | Upload a profile picture (multipart/form-data) |
| DELETE | `/delete-profile-image` | ✓ | Remove the current profile picture |
| POST | `/change-password` | ✓ | Change the account password |
| POST | `/logout` | ✓ | Clear the JWT cookie and log out |

### Contacts — `/api/contacts`
| Method | Path | Auth required | Description |
|--------|------|:---:|---|
| POST | `/search` | ✓ | Search users by first name, last name, or email |
| GET | `/get-contacts-for-dm` | ✓ | List contacts with whom the user has exchanged DMs |
| GET | `/get-all-contacts` | ✓ | List all users (used when creating a channel) |

### Messages — `/api/messages`
| Method | Path | Auth required | Description |
|--------|------|:---:|---|
| POST | `/get-messages` | ✓ | Retrieve the DM history between two users |
| POST | `/upload-file` | ✓ | Upload an attachment and receive its server path |

### Channels — `/api/channel`
| Method | Path | Auth required | Description |
|--------|------|:---:|---|
| POST | `/create-channel` | ✓ | Create a new channel with a name and member list |
| GET | `/get-user-channels` | ✓ | List channels where the user is a member or admin |
| GET | `/get-channel-messages/:channelId` | ✓ | Retrieve all messages in a channel |

## Socket.IO Events

The client connects to the Socket.IO server with `userId` in the query string so the server can map users to socket IDs.

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `sendMessage` | `{ sender, recipient, content, messageType, fileUrl }` | Send a direct message to another user |
| `send-channel-message` | `{ sender, channelId, content, messageType, fileUrl }` | Broadcast a message to a channel |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `receiveMessage` | Populated `Message` document | Delivered to both the sender and the recipient when a DM is sent |
| `receive-channel-message` | Populated `Message` document + `channelId` | Delivered to every member and the admin of the channel |

## Data Flow

### Direct Message
1. User submits a message in the **MessageBar**.
2. The client emits `sendMessage` via Socket.IO.
3. The server persists the message to MongoDB and populates sender/recipient fields.
4. The server emits `receiveMessage` to both users' sockets.
5. The **SocketContext** listener calls `addMessage` in the Zustand store.
6. **MessageContainer** re-renders with the new message.

### Channel Message
1. User submits a message while a channel is selected.
2. The client emits `send-channel-message` with the `channelId`.
3. The server creates the message, pushes its ID into `Channel.messages`, then fetches all channel members.
4. The server emits `receive-channel-message` to every member and the channel admin.
5. The Zustand store is updated and the UI re-renders.

### File Transfer
1. User selects a file in the **MessageBar** attachment picker.
2. The client POSTs the file to `POST /api/messages/upload-file` (with progress tracking via Axios `onUploadProgress`).
3. Multer saves the file to `uploads/files/` on the server and returns the file path.
4. The client emits a `sendMessage` or `send-channel-message` event with `messageType: "file"` and the returned `fileUrl`.
5. Recipients receive the message; **MessageContainer** detects the file type and renders an image preview or a download link.

## License

[MIT License](LICENSE)

## Contact

For questions or support, please contact the repository maintainers.