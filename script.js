const Player = marker => {
    const getMarker = () => marker;
    return {
        getMarker,
    }
};

// Keep track of the moves
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

// Update the display
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
    const highlightWinningMarkers = positions => {
        for (const id of positions) {
            const cell = document.getElementById(id);
            cell.classList.add("win");
            console.log(cell);
        }
    }
    return {
        renderBoard,
        updateCell,
        highlightWinningMarkers,
    };
})(); 

// Control the flow of the game
const gameController = (() => {
    let _player1 = Player("X");
    let _player2 = Player("O");
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
    // Check when the game is over and returns the positions of winning markers
    const _checkWinner = () => {
        const board = gameBoard.getBoard();
        // Check if a player has won
        const winCases = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6], 
            [1, 4, 7],
            [2, 5, 8], 
            [0, 4, 8], 
            [2, 4, 6],
        ];
        for (const indices of winCases) {
            if (board[indices[0]] === board[indices[1]] && board[indices[1]] === board[indices[2]]) {
                if (board[indices[0]] === _player1.getMarker()) {
                    return [_player1.getMarker(), indices];
                } else if (board[indices[0]] === _player2.getMarker()) {
                    return [_player2.getMarker(), indices];
                }
            }            
        }

        // Check if it's a tie
        if (!board.includes("")) {
            return ["tie", []];
        }

        // Return "none" if the game is not finished
        return ["none", []];
    }
    // Let player update their marker by clicking in the cell
    const play = clickedCell => {
        if (clickedCell.textContent === "") {
            gameBoard.updateValue(clickedCell.id, _activePlayer.getMarker());
            displayController.updateCell(clickedCell, _activePlayer.getMarker());
            _switchPlayer();
            [winner, positions] = _checkWinner();
            // Highlight the winning markers
            if (winner === _player1.getMarker() || winner === _player2.getMarker()) {
                displayController.highlightWinningMarkers(positions);
            }
        }
    };
    
    return {
        startNewGame,
        play,
    };
})();

gameController.startNewGame();