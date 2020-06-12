const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);
const { addUser, removeUser, getUser, getUsersInRoom, getRoomPositions, updateRoom, roomlist, START_POSITION } = require('./users.js');
const { checkMoveValidity } = require('./move.js');

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname+'/script.js');
});

app.get('/images/:file', (req, res) => {
    try { res.sendFile(__dirname+'/images/'+req.params['file']+'.png');}
    catch (error) { console.log(error) }
});

io.on('connection', (socket) => {

    for (i = 0; i < roomlist.length; i++) {
        if (getUsersInRoom(roomlist[i][0]).length < 2) {
            if (getUsersInRoom(roomlist[i][0]).length == 0) player = 1;
            else if (getUsersInRoom(roomlist[i][0]).length == 1) {
                if (getUsersInRoom(roomlist[i][0][0].player == 1)) player = 2;
                else player = 1;
            }
            addUser({ id: socket.id, room: roomlist[i][0], player});
            socket.join(roomlist[i][0]);
            break;
        } else if (i == roomlist.length - 1) {
            roomlist.push(['room-'+String(roomlist.length), START_POSITION])
            addUser({ id: socket.id, room: roomlist[i+1][0], player: 1 });
            socket.join(roomlist[i+1][0]);
            break;
        }
    }

    console.log(getUser(socket.id));
    socket.emit('sendPositions', { positions: getRoomPositions(getUser(socket.id).room), player: getUser(socket.id).player });

    socket.on('move', async ({ initial, final }) => {
        user = getUser(socket.id);
        room_positions = getRoomPositions(user.room);
        if (checkMoveValidity(room_positions, initial, final, user.player) === true) {
            room_positions[final[1]][final[0]] = room_positions[initial[1]][initial[0]];
            room_positions[initial[1]][initial[0]] = '';
            console.log(getRoomPositions(user.room));
            console.log();
            updateRoom(user.room, room_positions);
            console.log(getRoomPositions(user.room));
            io.to(user.room).emit('sendPositions', { positions: room_positions, player: user.player });
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