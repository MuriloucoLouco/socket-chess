var socket = io();

function preload() {
    images = {
        'pw': loadImage('images/pw'),
        'pb' :loadImage('images/pb'),
        'kw' :loadImage('images/kw'),
        'kb' :loadImage('images/kb'),
        'nw' :loadImage('images/nw'),
        'nb' :loadImage('images/nb'),
        'bw' :loadImage('images/bw'),
        'bb' :loadImage('images/bb'),
        'qw' :loadImage('images/qw'),
        'qb' :loadImage('images/qb'),
        'rw' :loadImage('images/rw'),
        'rb' :loadImage('images/rb'),
        ''   :loadImage('images/blank'), 
    }
}

function setup() {
    createCanvas(360, 360);
    holding = -1;
    isPressing = 0;
    isSending = 0;
}
var positions;

socket.on('sendPositions', (data) => {
    positions = data;
});

function sendMove(initial, final) {
    socket.emit('move', {initial, final});
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
    } else if (mouseIsPressed && holding != -1 && isPressing != 1) {
        let x = Math.floor(mouseX / 45);
        let y = Math.floor(mouseY / 45);
        sendMove([holding-8*Math.floor(holding/8),Math.floor(holding/8)],[x,y]);
        holding = -1;
        isSending = 1;
    }

    background(128);
    for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 8; k++) {
            let color;
            if (i % 2 === 0){ color = 0 }
            else { color = 1 }
            if (k % 2 === color) { fill(255); square(45*i, 45*k, 45) }
            else { fill(100); square(45*i, 45*k, 45) }
            if (i + 8 * k == holding) {
                fill(128, 255, 128); square(45*i, 45*k, 45);
            }
            if (holding != -1) {
                fill(128, 128, 255); square(45*Math.floor(mouseX / 45), 45*Math.floor(mouseY / 45), 45);
            }
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 8; k++) {
            if (i + 8 * k != holding) {
                image(images[positions[k][i]], 45 * i, 45 * k);
            }
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let k = 0; k < 8; k++) {
            if (i + 8 * k == holding) {
                image(images[positions[k][i]], mouseX-22, mouseY-22);
            }
        }
    }
}