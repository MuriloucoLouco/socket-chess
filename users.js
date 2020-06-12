const START_POSITION = [
    ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
    ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
    ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw']
];
const users = [];
var roomlist = [['room-0', START_POSITION]];

const addUser = ({id, room}) => {
    const user = { id, room };
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
  
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getRoomPositions = (room) => roomlist.filter((rooms) => rooms[0] === room)[0][1];

const updateRoom = (room, position) => {
    roomlist[roomlist.findIndex((element) => element[0] == room)][1] = position;
} 

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getRoomPositions, updateRoom, roomlist, START_POSITION };