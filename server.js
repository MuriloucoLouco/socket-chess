const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);
const util = require('util')
const { addUser, removeUser, getUser, getUsersInRoom, getRoomPositions, updateRoom, addRoom, getRoomLast, updateLast, roomlist } = require('./users.js');
const { checkMoveValidity } = require('./move.js');

//Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname+'/script.js');
});

app.get('/images/:file', (req, res) => {
    try { res.sendFile(__dirname+'/images/'+req.params['file']+'.png');}
    catch (error) { console.log(error); }
});

//Sockets
io.on('connection', (socket) => {
    
    for (i = 0; i < roomlist.length; i++) {

        let usersInRoom = getUsersInRoom(roomlist[i][0]);

        if (usersInRoom.length < 2) {

            if (usersInRoom.length == 0) {
                updateRoom(roomlist[i][0], [
                    ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
                    ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
                    ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw']
                ]);
                addUser({ id: socket.id, room: roomlist[i][0], player: 1 });
            } else if (usersInRoom.length == 1){
                if (usersInRoom[0].player == 1) {
                    addUser({ id: socket.id, room: roomlist[i][0], player: 2 });
                } else if (usersInRoom[0].player == 2) {
                    addUser({ id: socket.id, room: roomlist[i][0], player: 1 });
                }
            }
            socket.join(roomlist[i][0]);
            break;
        } else if (usersInRoom.length == 2 && i == roomlist.length - 1) {

            addRoom(i+1);
            addUser({ id: socket.id, room: roomlist[i+1][0], player: 1 });
            socket.join(roomlist[i+1][0]);
            break;
        }
    }
    
    user = getUser(socket.id);
    socket.emit('sendPlayer', { player: user.player });
    socket.emit('sendPositions', { positions: getRoomPositions(user.room) });
    socket.emit('lastPlayer', getRoomLast(user.room));
    io.to(user.room).emit('players', getUsersInRoom(user.room).length);

    console.log(`User ${user.id} joined ${user.room}.`);

    socket.on('move', ({ initial, final }) => {

        user = getUser(socket.id);
        room_positions = getRoomPositions(user.room);
        lastPlayer = getRoomLast(user.room);

        if (checkMoveValidity(room_positions, initial, final, user.player, lastPlayer) === true) {

            room_positions[final[1]][final[0]] = room_positions[initial[1]][initial[0]];
            room_positions[initial[1]][initial[0]] = '';

            updateRoom(user.room, room_positions);
            updateLast(user.room);

            io.to(user.room).emit('lastPlayer', lastPlayer);
            io.to(user.room).emit('sendPositions', { positions: room_positions });
        }
    });

    socket.on('disconnect', () => {
        removeUser(socket.id);
        io.to(user.room).emit('players', getUsersInRoom(user.room).length);
        console.log('User left:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log('Server running in port', PORT);
});
