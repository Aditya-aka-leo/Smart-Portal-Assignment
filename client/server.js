const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create HTTP server and attach WebSocket server to it
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, request) => {
  const user_id = new URL(request.url, `http://${request.headers.host}`).searchParams.get('userId');

  console.log(`User ${user_id} connected`);

  // Notify your notification system when user is online
  notifySystem(user_id, 'online');

  ws.on('close', () => {
    console.log(`User ${user_id} disconnected`);

    // Notify your notification system when user is offline
    notifySystem(user_id, 'offline');
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for user ${user_id}:`, error);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://13.235.241.174:${port}`);
});


const notifySystem = async (user_id, status) => {
  try {
    // Construct the payload
    const payload = {
      user_id : user_id,
      status : status,
    };

    // Send the POST request
    await axios.post('http://13.235.241.174:8081/notifyOnlineUser', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`Notification sent for user ${user_id}: ${status}`);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};
