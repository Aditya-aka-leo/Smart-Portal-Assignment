const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws, request) => {
  const user_id = new URL(request.url, `http://${request.headers.host}`).searchParams.get('userId');
  clients.set(user_id, ws);

  console.log(`User ${user_id} connected`);

  notifySystem(user_id, 'online');

  ws.on('message', (message) => {
    console.log(`Received message from user ${user_id}: ${message}`);
  });

  ws.on('close', () => {
    clients.delete(user_id);
    console.log(`User ${user_id} disconnected`);
    notifySystem(user_id, 'offline');
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for user ${user_id}:`, error);
  });
});

const notifySystem = async (user_id, status) => {
  try {
    const payload = {
      user_id: user_id,
      status: status,
    };

    await axios.post(`http://20.244.93.34:8081/notifyOnlineUser`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`Notification sent for user ${user_id}: ${status}`);
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

// Function to send notification to the client
const sendNotification = (user_id, notification) => {
  const client = clients.get(user_id);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(notification)); // Send JSON stringified notification
  }
};

// API to send a notification
app.post('/sendNotification', express.json(), (req, res) => {

  console.log("Push Initialized");
  console.log(`The web noti is : ${req.body}`);
  const { user_id, message, _id } = req.body;
  if (!user_id || !message || !_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Construct notification object
  const notification = {
    user_id,
    message,
    _id
  };

  sendNotification(user_id, notification);
  res.sendStatus(200);
});

server.listen(port, () => {
  console.log(`Server running at http://:${port}`);
});
