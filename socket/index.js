var { sessionMiddleware, app } = require('../app')
var server = require('http').createServer(app)
var createError = require('http-errors');
var passport = require('passport')
var socketio = require('socket.io')
var io = socketio(server)
var { userJoin,
    getCurrentUser,
    userLeave,
    saveChat } = require('./helper/messaging')

var wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))
io.use(wrap(passport.initialize()))
io.use(wrap(passport.session()))
io.use((socket, next) => {
    if (socket.request.user) {
        next()
    } else {
        next(createError(403))
    }
});

io.on('connection', socket => {

    socket.on('joinRoom', ({ from, to }) => {
        userJoin(socket.id, from, to).then(user => {
            socket.emit('getThreadId', { threadId: user.thread })
        })
        const user = getCurrentUser(to)

        if (user !== undefined)
            io.to(user.id).emit('heisonline')
    });

    socket.on('isonline', obj => {
        const user = getCurrentUser(obj.uid)
        if (user === undefined)
            io.to(socket.id).emit('heisoffline', { uid: undefined })
        else
            io.to(socket.id).emit('heisonline')
    })
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(msg.to);

        if (user !== undefined)
            io.to(user.id).emit('message', msg);
        io.to(socket.id).emit('message', msg);

        saveChat(msg)
    });

    socket.on('iamtyping', obj => {
        const user = getCurrentUser(obj.user);

        if (user !== undefined)
            io.to(user.id).emit('heistyping');
    })


    socket.on('iamstop', obj => {
        const user = getCurrentUser(obj.user);

        if (user !== undefined)
            io.to(user.id).emit('heisstop');
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user !== undefined)
            io.emit('heisoffline', { uid: user.uid })
    });
});

module.exports = { io, server }
