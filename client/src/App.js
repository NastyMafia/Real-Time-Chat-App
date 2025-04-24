import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';

// Connect to the Socket.IO server
// Make sure the URL matches your server's address and port
const SOCKET_SERVER_URL = 'https://realtime-chat-app-hrtq.onrender.com';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]); // List of online users
  const chatEndRef = useRef(null); // Ref to scroll to bottom of chat

  // Effect to initialize Socket.IO connection
  useEffect(() => {
    // Create socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setChat(prev => [...prev, { type: 'system', text: 'Disconnected from server.' }]);
    });

    // Listen for incoming messages
    newSocket.on('receiveMessage', (messageData) => {
      setChat(prevChat => [...prevChat, { type: 'message', ...messageData }]);
    });

    // Listen for user activity messages (join/leave)
    newSocket.on('userActivity', (activityMessage) => {
      setChat(prevChat => [...prevChat, { type: 'system', text: activityMessage }]);
    });

    // Listen for updates to the user list
    newSocket.on('updateUserList', (userList) => {
        setUsers(userList);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected on cleanup');
    };
  }, []); // Run only once on component mount

  // Effect to scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]); // Run whenever the chat state changes

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.emit('join', username.trim());
      setIsUsernameSet(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket && isUsernameSet) {
      // Emit the message to the server
      socket.emit('sendMessage', { text: message });
      // Clear the message input
      setMessage('');
    }
  };

  // Render Functions
  const renderChatMessage = (msg, index) => {
    if (msg.type === 'message') {
      // Determine if the message is from the current user (simple check by username)
      const isMe = msg.user === username;
      return (
        <div key={msg.id || index} className={`message ${isMe ? 'my-message' : 'other-message'}`}>
          {!isMe && <span className="message-user">{msg.user}:</span>}
          <span className="message-text">{msg.text}</span>
        </div>
      );
    } else if (msg.type === 'system') {
      return (
        <div key={index} className="message system-message">
          {msg.text}
        </div>
      );
    }
    return null; // Should not happen if types are handled
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Online Users ({users.length})</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
        <p className="connection-status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </p>
      </aside>

      <main className="chat-container">
        <h1>Real-Time Chat</h1>

        {!isUsernameSet ? (
          <form onSubmit={handleUsernameSubmit} className="username-form">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
            <button type="submit" disabled={!isConnected}>Join Chat</button>
             {!isConnected && <p style={{color: 'red', fontSize: '0.8em'}}>Connecting...</p>}
          </form>
        ) : (
          <>
            <div className="chat-messages">
              {chat.map(renderChatMessage)}
              <div ref={chatEndRef} /> {/* Element to scroll to */}
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={!isConnected} // Disable input if not connected
              />
              <button type="submit" disabled={!isConnected || !message.trim()}>
                Send
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
