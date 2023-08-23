const Player = marker => {
    const getMarker = () => marker;
    return {
        getMarker,
    }
};

const gameBoard = (() => {
    let _board = [];
    for (let i = 0; i < 9; i++) {
        _board.push("");
    }
    const getBoard = () =>  _board;
    const updateValue = (index, value) => {
        _board[index] = value;
    }
    return {
        getBoard,
        updateValue,
    };
})();

const displayController = (() => {
    const _createCell = (value, index) => {
        let cell = document.createElement("div");
        cell.id = index;
        cell.className = "cell";
        cell.textContent = value;
        cell.addEventListener("click", () => {
            gameController.play(cell);
        });
        return cell;
    };
    const renderBoard = () => {
        const board = gameBoard.getBoard();
        board.forEach((value, index) => {
            let cell = _createCell(value, index);
            const boardDiv= document.querySelector(".board");
            boardDiv.appendChild(cell);
        });
    };
    const updateCell = (cell, value) => {
        cell.textContent = value;
    };
    return {
        renderBoard,
        updateCell,
    };
})(); 

const gameController = (() => {
    let _player1 = Player("X");
    let _player2 = Player("0");
    let _activePlayer = _player1;
    const startNewGame = () => {
        displayController.renderBoard();
    };
    const _switchPlayer = () => {
        if (_activePlayer === _player1) {
            _activePlayer = _player2;
        } else {
            _activePlayer = _player1;
        }
    }
    // Let player update their marker by clicking in the cell
    const play = clickedCell => {
        if (clickedCell.textContent === "") {
            console.log(clickedCell.id);
            gameBoard.updateValue(clickedCell.id, _activePlayer.getMarker());
            displayController.updateCell(clickedCell, _activePlayer.getMarker());
            _switchPlayer();
        }
    };
    
    return {
        startNewGame,
        play,
    };
})();

gameController.startNewGame();