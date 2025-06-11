# 3AR Chat Application

A modern real-time chat application built with React, Vite, Socket.IO, and a robust component architecture.

## Technologies Used

- **React 18.3** - Frontend library
- **Vite** - Build tool and development server
- **Socket.IO** - Real-time communication
- **Zustand** - State management
- **TailwindCSS** - Styling with custom theme configuration
- **Axios** - API requests
- **Radix UI** - UI component primitives
- **React Router** - Navigation

## Features

- **Authentication** - Login and signup functionality
- **Real-time Messaging** - Instant message delivery using Socket.IO
- **Direct Messages** - Private messaging between users
- **Channels** - Group-based communication
- **Profile Management** - Update personal information, photos, and passwords
- **File Sharing** - Upload and download files in conversations
- **Responsive Design** - Works on both mobile and desktop

## Project Structure

```
client/
├── public/              # Static assets
│   └── vite.svg         # Vite logo
├── src/
│   ├── assets/          # Images, animations and other assets
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Base UI components (shadcn/ui based)
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── command.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── multipleselect.jsx
│   │       ├── scroll-area.jsx
│   │       ├── sonner.jsx
│   │       ├── tabs.jsx
│   │       └── tooltip.jsx
│   ├── context/         # React contexts
│   │   └── SocketContext.jsx  # Socket.IO context
│   ├── lib/             # Utility libraries
│   │   ├── api-client.js      # Axios instance
│   │   └── utils.js           # Helper functions
│   ├── pages/           # Application pages
│   │   ├── auth/              # Authentication pages
│   │   ├── chat/             # Chat interface
│   │   │   └── components/    # Chat-specific components
│   │   │       └── chat-container/  # Chat container components
│   │   └── profile/          # User profile management
│   ├── store/           # Zustand store
│   │   ├── index.js          # Store setup
│   │   └── slices/           # Store slices
│   │       ├── auth-slice.js  # Authentication state
│   │       └── chat-slice.js  # Chat state
│   ├── utils/           # Utility functions
│   │   └── constants.js      # API routes and constants
│   ├── App.jsx          # Main application component
│   ├── App.css          # Global styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles and Tailwind directives
├── components.json      # UI component configuration
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML entry point
├── jsconfig.json        # JavaScript configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```
