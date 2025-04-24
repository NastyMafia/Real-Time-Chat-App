# Real-Time Chat Application

This project demonstrates a simple real-time chat application built with Node.js, Express, Socket.IO, and React.

## Features

*   Real-time messaging between multiple users.
*   User join/leave notifications.
*   Display of currently online users.
*   Simple, clean interface.

## Technologies Used

*   **Backend**:
    *   Node.js
    *   Express.js
    *   Socket.IO (for WebSocket communication)
    *   `cors` (for handling cross-origin requests)
*   **Frontend**:
    *   React
    *   `socket.io-client` (for client-side WebSocket connection)
    *   CSS for styling

## Project Structure

realtime-chat-app/
├── client/ # React Frontend
│ ├── public/
│ ├── src/
│ │ ├── App.css
│ │ ├── App.js # Main React component
│ │ └── index.js
│ ├── package.json
│ └── ...
├── server/ # Node.js Backend
│ ├── node_modules/
│ ├── package.json
│ ├── server.js # Express/Socket.IO server logic
│ └── ...
└── README.md # This file


## Setup and Running

**Prerequisites:**

*   Node.js and npm (or yarn) installed.

**1. Clone the Repository**

```bash
git clone <url to be updated>
cd realtime-chat-app

-->	Running the Application
	You'll need two terminal windows/tabs.
->	Terminal 1: Start the Backend Server
		cd realtime-chat-app/server
		npm run dev
	You should see Server listening on *:4000

->	Terminal 2: Start the Frontend React App
		cd realtime-chat-app/client
		npm start
	This will typically open the application in your browser at http://localhost:3000

How to Use:
1.	Open http://localhost:3000 in two (or more) browser tabs or windows.
2.	In each tab, enter a unique username and click "Join Chat".
3.	You should see the user list update and join messages appear.
4.	Start typing messages in the input field at the bottom and press Enter or click "Send".
5.	Messages should appear in real-time in all connected tabs.
6.	Closing a tab will trigger a disconnect message and update the user list.

->	Install Backend Dependencies
		cd server
		npm install

->	Install Frontend Dependencies
		cd ../client
		npm install

->	Run the Backend Server
		Navigate back to the server directory and start the development server:
		cd ../server
		npm run dev

->	Run the Frontend Application
	Open a new terminal window/tab, navigate to the client directory, and start the React development 	server:	
		cd ../client


npm start
