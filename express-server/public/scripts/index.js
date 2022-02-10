$(function() {
  let socket = null;

  $("#connect").on('click', function() {
    const name = $("#name").val();
    if (socket || !name) return;
    console.log(name);
    socket = connect(name);
  });

  $("#disconnect").on('click', function() {
    disconnect(socket);
    socket = null;
  });

  $("#send").on('click', function(event) {
    send(socket);
  });

  $("#clear").on('click', function(event) {
    $("#messages").empty();
  });


});

// Create socket and add listeners
const connect = function(name) {

  // "io" comes from the included socket.io file (index.html)
  const socket = io();
  socket.on('connect', event => {
    console.log("connect: , ", name);
    socket.emit('register', name);
  });

  // Messages can have different event names
  // handle "notify" events (from server to us)
  socket.on('notify', function(msg) {
    $(".notify").html(msg);
  });

  // handle "status" events
  socket.on('status', function(msg) {
    console.log(msg);
    $(".connected").html(msg.connected);
    $(".active").html(msg.active);
  });

  // handle "message" events
  socket.on('private', function(msg) {
    console.log(msg);
    $("#messages").prepend(`<li class="private">${msg.from} says: ${msg.text}</li>`);
  });

  // handle "message" events
  socket.on('public', function(msg) {
    console.log(msg);
    $("#messages").prepend(`<li class="public">${msg.from} says: ${msg.text}</li>`);
  });

  return socket;
};

// Send chat message to the server
const send = function(socket) {
  const to = $("#to").val();
  const text = $("#message").val();
  console.log("send:", to, text);
  if (socket && text) {
    socket.emit('chat', { text, to });
  }
};

// Send an offline message to the server & disconnect
const disconnect = function(socket) {
  console.log("offline");
  if (socket) {
    socket.emit('offline', null);
    socket.disconnect();
    $(".notify").html("Not Connected");
    $(".connected").html("---");
    $(".active").html("---");
  }
};

