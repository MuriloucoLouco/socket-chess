function checkMoveValidity (positions, initial, final, player, last) {

    let ini_pos = positions[initial[1]][initial[0]];
    let fin_pos = positions[final[1]][final[0]];
    let adx = Math.abs(final[0]-initial[0]);
    let ady = Math.abs(final[1]-initial[1]);
    let dx = final[0]-initial[0];
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

    if (player == last)                                                                 return false;

    if (ini_pos == fin_pos)                                                             return false;
    if (ini_pos[1] == fin_pos[1])                                                       return false;
    if (ini_pos == '')                                                                  return false;
    if ((ini_pos[1] == 'w' && player != 1) || (ini_pos[1] == 'b' && player != 2))       return false;

    //Pawn
    if (ini_pos[0] == 'p' && dy != direc && initial[1] != row)                          return false;
    if (ini_pos[0] == 'p' && !(dy == 2*direc || dy == direc) && initial[1] == row)      return false;
    if (ini_pos[0] == 'p' && (adx > 1))                                                 return false;
    if (ini_pos[0] == 'p' && (fin_pos != '' && fin_pos[1] != ini_pos[1] && adx == 0))   return false;
    if (ini_pos[0] == 'p' && (fin_pos == '' && adx == 1))                               return false;

    //Knight
    if (ini_pos[0] == 'n' && !(adx == 1 && ady == 2) && !(adx == 2 && ady == 1))        return false;

    //King
    if (ini_pos[0] == 'k' && (adx > 1 || ady > 1))                                      return false; 

    //Rook
    if (ini_pos[0] == 'r' && (adx != 0 && ady != 0))                                    return false;
    if (ini_pos[0] == 'r') {
        if (ady == 0) {
            let way = dx / adx;
            let k = way;
            for (i = 1; i < adx; i++) {

                if (positions[initial[1]][initial[0]+k] != '')                          return false;
                k += way;
            }
        } else if (adx == 0) {
            let way = dy / ady;
            let k = way;
            for (i = 1; i < ady; i++) {
                
                if (positions[initial[1]+k][initial[0]] != '')                          return false;
                k += way;
            }
        }
    }

    //Bishop
    if (ini_pos[0] == 'b' && adx != ady)                                                return false;
    if (ini_pos[0] == 'b') {
        let way_x = dx / adx;
        let way_y = dy / ady;
        let kx = way_x;
        let ky = way_y;
        for (i = 1; i < adx; i++) {
            if (positions[initial[1]+ky][initial[0]+kx] != '')                          return false;
            kx += way_x;
            ky += way_y;
        }
    }

    //Queen
    if (ini_pos[0] == 'q' && !(!(adx != ady) || !(adx != 0 && ady != 0)))               return false;
    if (ini_pos[0] == 'q') {
        if (ady == 0) {
            let way = dx / adx;
            let k = way;
            for (i = 1; i < adx; i++) {

                if (positions[initial[1]][initial[0]+k] != '')                          return false;
                k += way;
            }
        } else if (adx == 0) {
            let way = dy / ady;
            let k = way;
            for (i = 1; i < ady; i++) {
                
                if (positions[initial[1]+k][initial[0]] != '')                          return false;
                k += way;
            }
        } else if (adx == ady) {
            let way_x = dx / adx;
            let way_y = dy / ady;
            let kx = way_x;
            let ky = way_y;
            for (i = 1; i < adx; i++) {
                if (positions[initial[1]+ky][initial[0]+kx] != '')                          return false;
                kx += way_x;
                ky += way_y;
            }
        }
    }

    return true;
}

module.exports = { checkMoveValidity };