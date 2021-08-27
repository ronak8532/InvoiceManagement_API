const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

exports.socketMessage = async (method, message) => {
    io.on('connection', function (socket) {
        socket.emit(method, { message: message })
    })
}