import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const PORT = process.env.PORT || 10000;

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
    origin: 'https://realtime-chat-ld7bqetpp-nastymafias-projects.vercel.app',
    methods: ['GET', 'POST'],
}));

// Allow requests from your React app's development server
const io = new Server(server, {
  cors: {
    origin: "https://realtime-chat-ld7bqetpp-nastymafias-projects.vercel.app", // Adjust if your React app runs on a different port
    methods: ["GET", "POST"]
  }
});

// Basic Express route (optional)
app.get('/', (req, res) => {
  res.send('Chat Server is running.');
});

const users = {}; // Store users { socketId: username } - simple in-memory store

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('join', (username) => {
    if (!username) { // Basic validation
      username = `User_${socket.id.substring(0, 4)}`;
    }
    users[socket.id] = username;
    console.log(`${username} (${socket.id}) joined the chat`);
    // Notify others (optional: send current user list)
    io.emit('userActivity', `${username} has joined the chat.`);
    io.emit('updateUserList', Object.values(users)); // Send updated list
  });

  // Handle incoming messages
  socket.on('sendMessage', (messageData) => {
    const username = users[socket.id] || `User_${socket.id.substring(0, 4)}`;
    console.log(`Message from ${username} (${socket.id}): ${messageData.text}`);
    // Broadcast the message to all connected clients, including the sender
    io.emit('receiveMessage', {
      user: username,
      text: messageData.text,
      id: Date.now() // Simple unique ID for React key prop
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`User disconnected: ${username} (${socket.id})`);
    if (username) {
      delete users[socket.id];
      // Notify others
      io.emit('userActivity', `${username} has left the chat.`);
      io.emit('updateUserList', Object.values(users)); // Send updated list
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on *:${PORT}`);
});
