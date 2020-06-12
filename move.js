function checkMoveValidity (positions, initial, final) {
    let ini_pos = positions[initial[1]][initial[0]];
    let fin_pos = positions[final[1]][final[0]];
    let adx = Math.abs(final[0]-initial[0]);
    let ady = Math.abs(final[1]-initial[1]);
    let dx = final[0]-initial[0];
    let dy = final[1]-initial[1]; 
    if (ini_pos == fin_pos) return false;
    if (ini_pos[1] == fin_pos[1]) return false;
    if (ini_pos == '') return false;
    if (ini_pos[0] == 'p' && dy != -1) return false;
    if (ini_pos[0] == 'r' && (adx != 0 && ady != 0)) return false;
    if (ini_pos[0] == 'n' && !(adx == 1 && ady == 2) && !(adx == 2 && ady == 1)) return false;
    if (ini_pos[0] == 'b' && adx != ady) return false;
    if (ini_pos[0] == 'q' && !(!(adx != ady) || !(adx != 0 && ady != 0))) return false;
    if (ini_pos[0] == 'k' && (adx > 1 || ady > 1)) return false; 
    else return true;
}

module.exports = { checkMoveValidity };