# 3AR Chat Application — Client

The React / Vite frontend for the 3AR Chat application.

## Technologies Used

| Technology | Purpose |
|---|---|
| React 18.3 + Vite | UI library and build tool |
| Zustand | Global state management |
| Socket.IO Client | Real-time bidirectional communication |
| Axios | HTTP REST requests |
| TailwindCSS | Utility-first styling |
| Radix UI / shadcn-ui | Accessible UI component primitives |
| React Router | Client-side routing |
| Moment.js | Date / time formatting |
| emoji-picker-react | In-chat emoji picker |
| Lucide React | Icon library |

## Features

- **Authentication** — Login form with JWT-cookie-based session
- **Real-time Messaging** — Instant DM and channel message delivery via Socket.IO
- **Direct Messages** — Private 1-to-1 conversations
- **Channels** — Group-based messaging with multiple members
- **Profile Management** — Update name, colour theme, profile picture, and password
- **File Sharing** — Attach files to any message with upload-progress feedback
- **Responsive Design** — Adapts to mobile and desktop layouts

## Project Structure

```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                  # Images, Lottie animations
│   ├── components/
│   │   └── ui/                  # Reusable Radix-based primitives
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── command.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── multipleselect.jsx
│   │       ├── scroll-area.jsx
│   │       ├── sonner.jsx       # Toast notifications
│   │       ├── tabs.jsx
│   │       └── tooltip.jsx
│   ├── context/
│   │   └── SocketContext.jsx    # Creates and exposes the Socket.IO instance
│   ├── lib/
│   │   ├── api-client.js        # Axios instance (baseURL from VITE_SERVER_HOST)
│   │   └── utils.js             # cn() helper and colour theme map
│   ├── store/
│   │   ├── index.js             # Zustand store combining all slices
│   │   └── slices/
│   │       ├── auth-slice.js    # userInfo state
│   │       └── chat-slice.js    # selectedChat, messages, DM contacts, channels
│   ├── utils/
│   │   └── constants.js         # API route string constants
│   ├── pages/
│   │   ├── auth/
│   │   │   └── index.jsx        # Login / signup page
│   │   ├── profile/
│   │   │   └── index.jsx        # Profile editor
│   │   └── chat/
│   │       ├── index.jsx        # Main three-column chat layout
│   │       └── components/
│   │           ├── contacts-container/
│   │           │   ├── index.jsx          # Sidebar wrapper
│   │           │   ├── contact-list.jsx   # Renders DM contacts + channels
│   │           │   └── components/
│   │           │       ├── new-dm/        # Search and start a new DM
│   │           │       ├── create-channel/# Create a new channel
│   │           │       └── profile-info/  # Current user's avatar + logout
│   │           ├── chat-container/
│   │           │   ├── index.jsx
│   │           │   └── components/
│   │           │       ├── chat-header/       # Contact/channel name + close button
│   │           │       ├── message-container/ # Scrollable message list
│   │           │       └── message-bar/       # Text input, emoji picker, file picker
│   │           └── empty-chat-container/
│   │               └── index.jsx              # Shown when no chat is selected
│   ├── App.jsx                  # Route definitions and auth guard
│   ├── App.css
│   ├── main.jsx                 # ReactDOM.createRoot entry point
│   └── index.css                # Tailwind directives + global styles
├── components.json              # shadcn/ui component configuration
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## State Management

The Zustand store is split into two slices:

**`auth-slice`**
- `userInfo` — the authenticated user object (or `null`)
- `setUserInfo(info)` — called after login / profile update

**`chat-slice`**
- `selectedChatType` — `'contact'` | `'channel'` | `null`
- `selectedChatData` — the currently open contact or channel object
- `selectedChatMessages` — messages for the open conversation
- `directMessagesContacts` — list of DM contacts (sorted by last activity)
- `channels` — list of channels the user belongs to
- File upload / download progress counters

## Socket.IO Integration

`SocketContext.jsx` creates a single Socket.IO connection when the user is authenticated and tears it down on logout. It registers two listeners:

| Server event | Action |
|---|---|
| `receiveMessage` | Calls `addMessage` and `addContactsInDMContacts` in the store |
| `receive-channel-message` | Calls `addMessage` and `addChannelInChannelList` in the store |

## Setup

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_SERVER_HOST=http://localhost:3001
```

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
