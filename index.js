const express = require('express');
const BodyParser = require("body-parser");
const InitiateMongoServer = require("./db");
const app = express();
const cors = require('cors');
require('dotenv').config();

const user = require("./routes/auth");
const room = require('./routes/rooms');
const message = require('./routes/messages');

var http = require('http').createServer(app);
var io = require('socket.io')(http);

const upload = require('./middlewares/upload');

const port = process.env.PORT || 8080;

InitiateMongoServer();

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })

    // user join room
    socket.on('join_room', (id_room) => {
        console.log('room', id_room);
        socket.join(id_room);
    })

    // new message
    socket.on('new_msg', (data) => {
        console.log('new_msg', data);
        const {id_user, id_room, message} = data;
        socket.to(id_room).emit('new_msg', {
            message,
            id_user
        })
    })

    // delete message
    socket.on('delete_msg', ({id_msg, id_room}) => {
        console.log('delete_msg', id_msg);
        socket.to(id_room).emit('delete_msg', {
            id_room,
            id_msg
        })
    })
})

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(upload);
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/user', user);
app.use('/room', room);
app.use('/message', message);
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
    //res.sendFile(__dirname + '/index.html');
});

http.listen(port, () => {
    console.log(`Server listening from port ${port}`);
});

//module.exports = { io };

