function checkMoveValidity (positions, initial, final, player) {

    let ini_pos = positions[initial[1]][initial[0]];
    let fin_pos = positions[final[1]][final[0]];
    let adx = Math.abs(final[0]-initial[0]);
    let ady = Math.abs(final[1]-initial[1]);
    let dy = final[1]-initial[1];

    if (player == 1) {
        direc = -1;
        row = 6;
        oposto = 'b';
    }
    if (player == 2) {
        direc = 1;
        row = 1;
        oposto = 'w';
    }

    if (ini_pos == fin_pos) return false;
    if (ini_pos[1] == fin_pos[1]) return false;
    if (ini_pos == '') return false;
    if ((ini_pos[1] == 'w' && player != 1) || (ini_pos[1] == 'b' && player != 2)) return false;

    if (ini_pos[0] == 'p' && dy != direc && initial[1] != row) return false;
    if (ini_pos[0] == 'p' && !(dy == 2*direc || dy == direc) && initial[1] == row) return false;
    if (ini_pos[0] == 'p' && (adx > 1)) return false;
    if (ini_pos[0] == 'p' && (fin_pos != '' && fin_pos[1] != ini_pos[1] && adx == 0)) return false;
    if (ini_pos[0] == 'p' && (fin_pos == '' && adx == 1)) return false;

    if (ini_pos[0] == 'r' && (adx != 0 && ady != 0)) return false;
    if (ini_pos[0] == 'n' && !(adx == 1 && ady == 2) && !(adx == 2 && ady == 1)) return false;
    if (ini_pos[0] == 'b' && adx != ady) return false;
    if (ini_pos[0] == 'q' && !(!(adx != ady) || !(adx != 0 && ady != 0))) return false;
    if (ini_pos[0] == 'k' && (adx > 1 || ady > 1)) return false; 

    // for (let i = 0; i < Math.floor(Math.sqrt(dx**2 + dy**2)); i++) {
    //     if (['r', 'b', 'q'].includes(ini_pos[0])) {
            
    //     }
    // }

    for (x = 0, y = 0; x < adx, y < ady; x++, y++) {
        if (ini_pos[0] == 'r' && positions[initial[0] + x][0][1] == oposto) return false;
        if (ini_pos[0] == 'r' && positions[initial[1] + y][1][1] == oposto) return false;
    }

    return true;
}

module.exports = { checkMoveValidity };