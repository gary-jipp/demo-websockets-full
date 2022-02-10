const express = require('express');
const socketServer = require('./socketServer');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("public"));

const httpServer = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Handle webSocket connections
socketServer.listen(httpServer);