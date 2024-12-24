const boardVisual = document.querySelector(".board");

const board = (function() {
    const _board = [];
    const size = [3,3];
    const getSpot = (x,y) => {
        const index = size[0]*x+y;
        return _board[size[0]*x+y];
    }
    const setSpot = (x,y,player) => {_board[size[0]*x+y] = player;};
    const getRow = (x) => [_board[x*size[0]+0], _board[x*size[0]+1], _board[x*size[0]+2]]
    const getCol = (x) => [_board[0*size[0]+x], _board[1*size[0]+x], _board[2*size[0]+x]]
    const getDiagCres = () => [_board[2*size[0]+0], _board[4], _board[2]]
    const getDiagDesc = () => [_board[0], _board[4], _board[8]]
    const printBoard = () => console.log(_board)
    return {getSpot, setSpot, getRow, getCol, getDiagCres, getDiagDesc, printBoard}
})();


function createPlayer(player) {
    const value = player;
    const get = () => value;
    return {get}
}


const turnManager = (function() {
    let turn = 0;
    const getTurn = () => turn;
    const passTurn = () => turn++;
    return {getTurn, passTurn}
})();


function createGame (board, turnManager) {
    let _is_over = false;
    const _board = board;
    const _player1 = createPlayer(1);
    const _player2 = createPlayer(2);
    const _turnManager = turnManager;
    const _activePlayer = () => _turnManager.getTurn() % 2 == 0 ? _player1.get() : _player2.get();

    const _checkLine = (line) => {
        let result = true;
        for (let spot of line) {
            if (spot == undefined || spot != line[0]) {
                return false
            }
        }
        return result
    }

    const play = (x,y) => {
        if (_is_over) {
            return
        }
        if (board.getSpot(x,y) == _player1.get() || board.getSpot(x,y) == _player2.get()) {
            return
        }
        board.setSpot(x,y,_activePlayer());
        if (_checkLine(_board.getRow(x))||_checkLine(_board.getCol(y))||_checkLine(_board.getDiagCres())||_checkLine(_board.getDiagDesc())){
            console.log(_activePlayer() + " Won!")
            _is_over = true;
        };
        board.printBoard();
        _turnManager.passTurn();
    }
    return {play}
};

const game = createGame(board,turnManager)
game.play(0,0);
game.play(1,0);
game.play(1,1);
game.play(1,2);
game.play(2,2);
game.play(2,1);