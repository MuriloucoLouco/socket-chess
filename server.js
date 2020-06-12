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
            let user = addUser({ id: socket.id, room: roomlist[i][0] });
            socket.join(roomlist[i][0]);
            console.log(socket.id, 'entrou na sala', roomlist[i][0]);
            break;
        } else if (i == roomlist.length - 1) {
            roomlist.push(['room-'+String(roomlist.length), START_POSITION])
            let user = addUser({ id: socket.id, room: roomlist[i+1][0] });
            console.log(socket.id, 'criou a sala', roomlist[i+1][0]);
            socket.join(roomlist[i+1][0]);
            break;
        }
    }
    socket.emit('sendPositions', getRoomPositions(getUser(socket.id).room));

    socket.on('move', ({ initial, final }) => {
        let user = getUser(socket.id);
        let room_positions = getRoomPositions(user.room);
        
        if (checkMoveValidity(room_positions, initial, final) === true) {
            room_positions[final[1]][final[0]] = room_positions[initial[1]][initial[0]];
            room_positions[initial[1]][initial[0]] = '';
            updateRoom(user.room, room_positions);
            io.to(user.room).emit('sendPositions', room_positions);
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