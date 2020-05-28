const WebSocket = require('ws');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express(); app.use(cors());

const wPort=80;
// const aPort=process.env.PORT||5001;
const wss = new WebSocket.Server({ port: wPort }, () => {
    console.log("Signaling server is now listening on port-"+wPort);
});

// // parse requests of content-type - application/x-www-form-urlencoded
 
// app.use(bodyParser.urlencoded({ extended: true }));

// // parse requests of content-type - application/json
 
// app.use(bodyParser.json());
 
// // define a simple route
// app.get('/', (req, res) => {
// res.send("App Working");
 
// });
 
// app.listen(aPort, () => console.log(`Example app listening on port ${aPort}!`));

// Broadcast to all.
wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws) => {
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`)
    
    ws.onmessage = (message) => {
        console.log(message.data + "\n");
        wss.broadcast(ws, message.data);
    }

    ws.onclose = () => {
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`)
    }
});