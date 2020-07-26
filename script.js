var socket = io();
var canvas = document.getElementById('chess')
ctx = canvas.getContext('2d');

holding = -1;
isPressing = 0;
isSending = 0;
var positions;
player = 1;
mouseIsPressed = false;
mouseX = 0;
mouseY = 0;

images = {
	'pw' : document.getElementById('pw'),
	'pb' : document.getElementById('pb'),
	'kw' : document.getElementById('kw'),
	'kb' : document.getElementById('kb'),
	'nw' : document.getElementById('nw'),
	'nb' : document.getElementById('nb'),
	'bw' : document.getElementById('bw'),
	'bb' : document.getElementById('bb'),
	'qw' : document.getElementById('qw'),
	'qb' : document.getElementById('qb'),
	'rw' : document.getElementById('rw'),
    'rb' : document.getElementById('rb'),
    ''   : document.getElementById('blank'),
}

window.addEventListener('mousemove', (e) => {
	var rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
});

window.addEventListener('mousedown', (e) => {
	mouseIsPressed = true
})

window.addEventListener('mouseup', (e) => {
	mouseIsPressed = false
})

document.getElementById("text-box").addEventListener("keydown", (e) => {
    if (!e) {
		var e = window.event;
	}

    if (e.keyCode == 13) {
		inputSend();
	}
}, false);



socket.on('sendPlayer', (data) => {
    player = data.player;
    document.getElementById('player').innerHTML = `You are player ${player}.`;
});

socket.on('sendPositions', (data) => {
    positions = data.positions;
});


socket.on('lastPlayer', (data) => {
    lastPlayer = data;
    turn = lastPlayer-1 ? 'black' : 'white';
    document.getElementById('turn').innerHTML = `Turn: ${turn}`;
});

socket.on('players', (data) => {
    document.getElementById('number').innerHTML = data - 1 ? 'Opponent online' : 'Waiting new players...';
});

socket.on('finish', (data) => {
    winner = data;
    
    if (winner == player) {
        document.getElementById('finish').innerHTML = 'You won!';
    } else {
        document.getElementById('finish').innerHTML = 'You losed.';
    }
});

socket.on('message', (data) => {
	document.getElementById('messages').innerHTML += `<span class="${(data.emiter == player) ? 'itself' : 'other'}">${data.message}</span><br>`
});

function inputSend() {
	sendMessage(document.getElementById('text-box').value);
	document.getElementById('text-box').value='';
}

function sendMessage(message) {
	socket.emit('message', message);
}

function flip(matrix) {
    temp_matrix = Array();

    for (i = 0; i < matrix.length; i++) {
        temp_array = Array();

        for (k = 0; k < matrix[i].length; k++) {
            temp_array.unshift(matrix[i][k]);
        }
        temp_matrix.unshift(temp_array);
    }

    return temp_matrix;
}

function sendMove(initial, final) {
    if (initial != final) {
        if (player-1) {
            socket.emit('move', { initial : [ 7 - initial[0], 7 - initial[1] ], final : [ 7 - final[0], 7 - final[1] ] });
        } else {
            socket.emit('move', { initial, final });
        }
    }
}

function draw() {
    if (mouseIsPressed && holding == -1 && isSending == 0) {
        let x = Math.floor(mouseX / 45);
        let y = Math.floor(mouseY / 45);
        holding = x + y * 8;
        isPressing = 1;

    } else if (!mouseIsPressed) {
        isPressing = 0;
        isSending = 0;

    } else if (mouseIsPressed && holding != -1 && isPressing != 1 && (mouseX > 0 && mouseX < 360 && mouseY > 0 && mouseY < 360)) {
        let x = Math.floor(mouseX / 45);
        let y = Math.floor(mouseY / 45);
        sendMove([holding-8*Math.floor(holding/8),Math.floor(holding/8)],[x,y]);
        holding = -1;
        isSending = 1;
    }
	
	flipped = player-1 ? flip(positions) : positions;

	ctx.fillStyle = '#b8803b';
    ctx.fillRect(0,0,360,360);
    for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 8; k++) {
            let color;
            if (i % 2 === 0){ color = 0 }
            else { color = 1 }
            if (k % 2 === color) {
				ctx.fillStyle = '#b8803b';
				ctx.fillRect(45*i, 45*k, 45, 45)
			}
            else {
				ctx.fillStyle = '#401806';
				ctx.fillRect(45*i, 45*k, 45, 45)
			}
            if (i + 8 * k == holding) {
                ctx.fillStyle = 'rgb(128, 128, 255)';
				ctx.fillRect(45*i, 45*k, 45, 45);
            }
            if (holding != -1) {
                ctx.fillStyle = 'rgb(128, 255, 128)';
				ctx.fillRect(45*Math.floor(mouseX / 45), 45*Math.floor(mouseY / 45), 45, 45);
            }
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 8; k++) {
            if (i + 8 * k != holding) {
                ctx.drawImage(images[flipped[k][i]], 45 * i, 45 * k);
            }
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 8; k++) {
            if (i + 8 * k == holding) {
                ctx.drawImage(images[flipped[k][i]], mouseX-22, mouseY-22);
            }
        }
    }
}

setInterval(draw, 10);
