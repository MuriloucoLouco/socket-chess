const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);
const util = require('util')
const { addUser, removeUser, getUser, getUsersInRoom, getRoomPositions, updateRoom, addRoom, roomlist, START_POSITION } = require('./users.js');
const { checkMoveValidity } = require('./move.js');

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

io.on('connection', (socket) => {
    
    for (i = 0; i < roomlist.length; i++) {

        let usersInRoom = getUsersInRoom(roomlist[i][0]);

        if (usersInRoom.length < 2) {

            if (usersInRoom.length == 0) {
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
    
    
    socket.emit('sendPlayer', { player: getUser(socket.id).player });
    socket.emit('sendPositions', { positions: getRoomPositions(getUser(socket.id).room) });

    console.log(getUser(socket.id));

    socket.on('move', ({ initial, final }) => {

        user = getUser(socket.id);
        room_positions = getRoomPositions(user.room);

        if (checkMoveValidity(room_positions, initial, final, user.player) === true) {

            room_positions[final[1]][final[0]] = room_positions[initial[1]][initial[0]];
            room_positions[initial[1]][initial[0]] = '';

            user = getUser(socket.id);
            updateRoom(user.room, room_positions);

            io.to(user.room).emit('sendPositions', { positions: room_positions });
        }
    });

    socket.on('disconnect', () => {
        removeUser(socket.id);
        console.log('Usuário meteu o pé.', socket.id);
    });
});

server.listen(PORT, () => {
    console.log('Servidor rodando em:', PORT);
});
