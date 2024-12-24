const boardVisual = document.querySelector(".board");
const result = document.querySelector(".result");
const newGameButton = document.querySelector("#newGame");
const inputPlayer1 = document.querySelector("#player1");
const inputPlayer2 = document.querySelector("#player2");

const board = (function() {
    let _board = [];
    const size = [3,3];
    const getSpot = (x,y) => {
        const index = size[0]*x+y;
        return _board[size[0]*x+y];
    }
    const setSpot = (x,y,player) => {_board[size[0]*x+y] = player;};
    const getRow = (x) => [_board[x*size[0]+0], _board[x*size[0]+1], _board[x*size[0]+2]];
    const getCol = (x) => [_board[0*size[0]+x], _board[1*size[0]+x], _board[2*size[0]+x]];
    const getDiagCres = () => [_board[2*size[0]+0], _board[4], _board[2]];
    const getDiagDesc = () => [_board[0], _board[4], _board[8]];
    const printBoard = () => console.log(_board);
    const reset = () => _board = [];
    return {getSpot, setSpot, getRow, getCol, getDiagCres, getDiagDesc, printBoard, reset}
})();


function createPlayer(token, name) {
    const value = token;
    const _name = name;
    const get = () => value;
    const getName = () => _name;
    return {get, getName}
}


const turnManager = (function() {
    let turn = 0;
    const getTurn = () => turn;
    const passTurn = () => turn++;
    const reset = () => turn = 0;
    return {getTurn, passTurn, reset}
})();


function createGame (board, turnManager, p1name, p2name) {
    let _is_over = false;
    const _board = board;
    _board.reset();
    const _player1 = createPlayer("X", p1name);
    const _player2 = createPlayer("O", p2name);
    const _turnManager = turnManager;
    _turnManager.reset();
    const _activePlayer = () => _turnManager.getTurn() % 2 == 0 ? _player1 : _player2;

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
            return board.getSpot(x,y)
        }
        if (board.getSpot(x,y) == _player1.get() || board.getSpot(x,y) == _player2.get()) {
            return board.getSpot(x,y)
        }
        board.setSpot(x,y,_activePlayer().get());
        if (_checkLine(_board.getRow(x))||_checkLine(_board.getCol(y))||_checkLine(_board.getDiagCres())||_checkLine(_board.getDiagDesc())){
            result.textContent = _activePlayer().getName() + " Won!"; 
            _is_over = true;
        };
        _turnManager.passTurn();
        return board.getSpot(x,y)
    }
    return {play}
};


const gameRenderer= (function() {

    let _game = null;

    const _makeUpdateSpot = (i,j,game, button) => {
        const x = i;
        const y = j;
        const _game = game;
        const _button = button;
        return function updateSpot ()  {
            _button.textContent = _game.play(x,y);
        }
    }

    const newGame = () => {
        _clearBoard();
        _game = createGame(board,turnManager, inputPlayer1.value, inputPlayer2.value);
        _renderBoard();
    }

    const _renderBoard = () => {
        let table = document.createElement("table");
        table.classList.add("table");
        boardVisual.appendChild(table);
        for(let i=0; i<3; i++) {
            const row = document.createElement("tr");
            table.appendChild(row)
            
            for(let j=0; j<3; j++) {
                const col = document.createElement("td");
                row.appendChild(col);
                
                const button = document.createElement("button");
                button.classList.add("myButton");
                button.addEventListener("click", _makeUpdateSpot(i,j, _game, button))
                col.appendChild(button);
            }
        }
    }

    const _clearBoard = () => {
        if (_game){
            boardVisual.removeChild(boardVisual.firstChild);
            result.textContent = "";
        }
    }
    return {newGame}
})()

newGameButton.addEventListener("click",gameRenderer.newGame)
