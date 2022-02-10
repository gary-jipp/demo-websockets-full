import 'App.css';
import { useEffect, useState } from 'react';
import io from "socket.io-client";

export default function App() {
  const [socket, setSocket] = useState("");
  const [name, setName] = useState("");
  const [notify, setNotify] = useState();
  const [status, setStatus] = useState({});
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [to, setTo] = useState("");

  const clear = function() {
    setMessages([]);
  };

  // This app makes a websocket connection immediately
  useEffect(() => {
    // Connect to server
    const socket = io("/");
    setSocket(socket);

    // All This stuff should be a Custom Hook, right?
    socket.on('connect', event => {
      console.log("connected");
    });

    socket.on('notify', msg => {
      setNotify(msg);
    });

    socket.on('status', msg => {
      setStatus(msg);
    });

    socket.on('public', msg => {
      setMessages(prev => ["Broadcast: " + msg.text, ...prev]);
    });

    socket.on('private', msg => {
      setMessages(prev => [`${msg.from} says: ${msg.text}`, ...prev]);
    });

    // ensures we disconnect to avoid memory leaks
    return () => socket.disconnect();
  }, []);

  const onTextChange = function(event) {
    setText(event.target.value);
  };
  const onToChange = function(event) {
    setTo(event.target.value);
  };
  const onNameChange = function(event) {
    setName(event.target.value);
  };

  const connect = function() {
    console.log("register", name);
    socket && name && socket.emit('register', name);
  };

  const disconnect = function() {
    socket && socket.emit('offline');
  };

  // Send chat message to the server
  const send = function() {
    socket && text && socket.emit('chat', { text, to });
  };

  const list = messages.map((msg, i) => {
    return <li key={i}>{msg}</li>;
  });

  return (
    <div className="App">
      <h1>Web Sockets React</h1>
      <h4>
        <div>
          <span>{status.connected}</span> clients connected
        </div>
        <div>
          <span>{status.active}</span> clients active
        </div>
        <div className="notify">{notify}</div>
      </h4>

      <div><input onChange={onNameChange} value={name} placeholder="Name" /></div>
      <button onClick={connect}>Login</button>
      <button onClick={disconnect}>Logout</button>
      <div><input onChange={onToChange} value={to} placeholder="To" /></div>
      <div>
        <textarea onChange={onTextChange} placeholder="Type a message" ></textarea>
      </div>

      <button onClick={send}>Send</button>
      <button onClick={clear}>Clear</button>
      <ul>
        {list}
      </ul>
    </div >
  );
}