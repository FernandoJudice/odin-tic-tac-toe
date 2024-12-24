const boardVisual = document.querySelector(".board");

const board = (function() {
    const _board = [];
    const size = [3,3];
    const getSpot = (x,y) => {
        const index = size[0]*x+y;
        return _board[size[0]*x+y];
    }
    const setSpot = (x,y,player) => {_board[size[0]*x+y] = player;};
    return {getSpot, setSpot}
})();


function createPlayer(player) {
    const player = player;
    const get = () => player;
    return {get}
}


const turnManager = (function() {
    const turn = 0;
    const getTurn = () => turn;
    const passTurn = () => turn++;
})();


const game = (function(board, player1, player2, turnManager) {
    const _board = board;
    const _player1 = player1;
    const _player2 = player2;
    const _turnManager = turnManager;
    const _activePlayer = () => _turnManager.getTurn % 2 == 0 ? player1.get() : player2.get();

    const play = (x,y) => {
        board.setSpot(x,y,_activePlayer());
        _turnManager.passTurn();
    }

})();