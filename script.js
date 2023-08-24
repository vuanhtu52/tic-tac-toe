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

    const getBoard = () => _board;

    const updateValue = (index, value) => {
        _board[index] = value;
    };

    const reset = () => {
        _board = [];
        for (let i = 0; i < 9; i++) {
            _board.push("");
        }
    };

    return {
        getBoard,
        updateValue,
        reset,
    };
})();

// Update the display
const displayController = (() => {
    const _handleCellClick = event => {
        gameController.play(event.currentTarget);
    };

    const _createCell = (value, index) => {
        let cell = document.createElement("div");
        cell.id = index;
        cell.className = "cell";
        cell.textContent = value;
        cell.addEventListener("click", _handleCellClick, true);
        return cell;
    };

    const renderBoard = () => {
        const board = gameBoard.getBoard();
        const boardDiv = document.querySelector(".board");
        // Remove old cells
        while (boardDiv.lastElementChild) {
            boardDiv.removeChild(boardDiv.lastElementChild);
        }
        // Create new cells
        board.forEach((value, index) => {
            let cell = _createCell(value, index);
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
        }
    };

    const updateMessage = message => {
        const messageDiv = document.querySelector(".message");
        messageDiv.textContent = message;
    };

    const freezeBoard = () => {
        const board = gameBoard.getBoard();
        for (let i = 0; i < board.length; i++) {
            const cell = document.getElementById(i);
            cell.removeEventListener("click", _handleCellClick, true);
        }
    }

    const reset = () => {
        renderBoard();
        updateMessage(`Player ${gameController.getActivePlayer().getMarker()}'s turn`);
    };

    const _setRestartButton = () => {
        const restartButton = document.querySelector(".restart");
        restartButton.addEventListener("click", () => {
            gameController.startNewGame();
        });
    };
    _setRestartButton(); // Set the restart button once initially

    return {
        renderBoard,
        updateCell,
        highlightWinningMarkers,
        updateMessage,
        freezeBoard,
        reset
    };
})();

// Control the flow of the game
const gameController = (() => {
    let _player1 = Player("X");
    let _player2 = Player("O");
    let _activePlayer = _player1;

    const _reset = () => {
        _player1 = Player("X");
        _player2 = Player("O");
        _activePlayer = _player1;
    };

    const startNewGame = () => {
        gameBoard.reset();
        _reset();
        displayController.reset();
    };

    const getActivePlayer = () => _activePlayer;

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
            // Update the value in the board
            gameBoard.updateValue(clickedCell.id, _activePlayer.getMarker());
            // Display the marker on the board
            displayController.updateCell(clickedCell, _activePlayer.getMarker());
            // Switch player
            _switchPlayer();
            displayController.updateMessage(`Player ${_activePlayer.getMarker()}'s turn`);
            // Check if the game is over
            [winner, positions] = _checkWinner();
            // If someone has won
            if (winner === _player1.getMarker() || winner === _player2.getMarker()) {
                // Highlight the winning markers
                displayController.highlightWinningMarkers(positions);
                // Display winner
                if (winner === _player1.getMarker()) {
                    displayController.updateMessage(`Player ${_player1.getMarker()} won!`);
                } else {
                    displayController.updateMessage(`Player ${_player2.getMarker()} won!`);
                }
                // Freeze the board
                displayController.freezeBoard();
            }
            // Update messge if it's a tie
            if (winner === "tie") {
                displayController.updateMessage("It's a tie!");
            }
        }
    };

    return {
        startNewGame,
        play,
        getActivePlayer,
    };
})();

gameController.startNewGame();