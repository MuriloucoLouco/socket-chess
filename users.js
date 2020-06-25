const users = [];
roomlist = [
    ['room-0',
    [
        ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
        ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw']
    ],
    2
    ]
];

const addUser = ({id, room, player }) => {
    const user = { id, room, player };
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

const getRoomLast = (room) => roomlist.filter((rooms) => rooms[0] === room)[0][2];

const updateLast = (room) => {
    new_last = getRoomLast(room)-1 ? 1 : 2;
    roomlist[roomlist.findIndex((element) => element[0] == room)][2] = new_last;
}

const updateRoom = (room, position) => {
    roomlist[roomlist.findIndex((element) => element[0] == room)][1] = position;
}

const addRoom = (roomNumber) => roomlist.push([
    'room-'+roomNumber,
    [
        ['rb', 'nb', 'bb', 'qb', 'kb', 'bb', 'nb', 'rb'],
        ['pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb', 'pb'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw', 'pw'],
        ['rw', 'nw', 'bw', 'qw', 'kw', 'bw', 'nw', 'rw']
    ],
    1
]);

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getRoomPositions, updateRoom, addRoom, getRoomLast, updateLast, roomlist };
