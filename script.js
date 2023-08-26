const Player = marker => {
    const getMarker = () => marker;

    return {
        getMarker,
    }
};

// Inherit from Player
const AI = marker => {
    const prototype = Player(marker);

    // The maximum is exclusive and the minimum is inclusive
    const _getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
    };

    // Return the index of the next move
    const makeRandomMove = () => {
        const board = gameBoard.getBoard();
        let availableCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                availableCells.push(i);
            }
        }
        const randomIdex = _getRandomInt(0, availableCells.length);
        return availableCells[randomIdex];
    };

    // Check if there is any move left on the board
    const _hasMovesLeft = board => {
        return board.includes("");
    };

    // Evaluate the value of the current board. Returns +10, -10 or 0 depending on the winner
    const _evaluate = board => {
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
                if (board[indices[0]] === gameController.getPlayer1().getMarker()) {
                    return 10;
                } else if (board[indices[0]] === gameController.getPlayer2().getMarker()) {
                    return -10;
                }
            }
        }

        // Return 0 if none has won the game
        return 0;
    };

    // Calculate the score for all each move recursively
    const _minimax = (board, depth, isMax) => {
        let score = _evaluate(board);

        // Return 10 if the maximizer has won
        if (score === 10) {
            return score;
        }

        // Return -10 if the minimizer has won
        if (score === -10) {
            return score;
        }

        // Return 0 if it is a tie
        if (_hasMovesLeft(board) === false) {
            return 0;
        }

        // If it is the maximizer's move
        if (isMax) {
            let best = -1000;
            // Traverse all cells
            for (let i = 0; i < board.length; i++) {
                // Check if the cell is empty
                if (board[i] === "") {
                    // Make the move
                    board[i] = gameController.getPlayer1().getMarker();
                    // Call minimax recursively and choose the maximum value
                    best = Math.max(best, _minimax(board, depth+1, !isMax));
                    // Undo the move
                    board[i] = "";
                }
            }
            return best;
        }

        // If it is the minimizer's move
        if (isMax === false) {
            let best = 1000;
            // Traver all cells
            for (let i = 0; i < board.length; i++) {
                // Check if the cell is empty
                if (board[i] === "") {
                    // Make the move
                    board[i] = gameController.getPlayer2().getMarker();
                    // Call minimax recursively and choose the minimum value
                    best = Math.min(best, _minimax(board, depth+1, !isMax));
                    // Undo the move
                    board[i] = "";
                }
            }
            return best;
        }
    };

    // Return the index of the best move using minmax algorithm
    const makeBestMove = board => {
        let bestVal = 1000;
        let bestPosition = -1;

        // Traverse all cells, evaluate minimax function for all empty cells and return the cell with optimal value
        for (let i = 0; i < board.length; i++) {
            // Check if the cell is empty
            if (board[i] === "") {
                // Make the move
                board[i] = gameController.getActivePlayer().getMarker();
                // Compute evaluation for this move
                let moveVal = _minimax(board, 0, true);
                // Undo the move
                board[i] = "";
                // If the value of the current move is less than the best value, update best
                if (moveVal < bestVal) {
                    bestPosition = i;
                    bestVal = moveVal;
                }
            }
        }
        return bestPosition;
    };
    
    return Object.assign({},  prototype, {
        makeRandomMove,
        makeBestMove,
    });
}

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
        if (gameController.getMode() === "friend") {
            updateMessage(`Player ${gameController.getActivePlayer().getMarker()}'s turn`);
        } else {
            updateMessage("Make a move");
        }
        
    };

    const setRestartButton = () => {
        const restartButton = document.querySelector(".restart");
        restartButton.addEventListener("click", () => {
            gameController.startNewGame();
        });
    };

    const setModeSelector = () => {
        const selector = document.querySelector("#modes");
        selector.addEventListener("change", () => {
            gameController.startNewGame();
        });
    }

    const getMode = () => {
        const selector = document.querySelector("#modes");
        return selector.value;
    }

    return {
        renderBoard,
        updateCell,
        highlightWinningMarkers,
        updateMessage,
        freezeBoard,
        reset,
        getMode,
        setRestartButton,
        setModeSelector,
    };
})();

// Control the flow of the game
const gameController = (() => {
    let _player1 = Player("X");
    let _player2 = AI("O");
    let _activePlayer = _player1;
    let _mode = displayController.getMode();

    // Initialize the game at the beginning
    const init = () => {
        displayController.setRestartButton();
        displayController.setModeSelector();
        startNewGame();
    };

    const _reset = () => {
        _mode = document.querySelector("#modes").value;
        _player1 = Player("X");
        if (_mode == "friend") {
            _player2 = Player("O");
        } else {
            _player2 = AI("O");
        }
        _player2 = AI("O");
        _activePlayer = _player1;
    };

    const startNewGame = () => {
        gameBoard.reset();
        _reset();
        displayController.reset();
    };

    const getPlayer1 = () => _player1;

    const getPlayer2 = () => _player2;

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
            if (_mode === "friend") {
                displayController.updateMessage(`Player ${_activePlayer.getMarker()}'s turn`);
            }
            
            // If the mode is easy, make the next move with AI
            if (_mode === "easy" && gameBoard.getBoard().includes("")) {
                const position = _player2.makeRandomMove();
                // Update the value in the board
                gameBoard.updateValue(position, _activePlayer.getMarker());
                // Display the marker on the board
                displayController.updateCell(document.getElementById(position.toString()), _activePlayer.getMarker());
                // Switch player
                _switchPlayer();
            }

            // If the mode is hard, make the next move with AI
            if (_mode === "hard" && gameBoard.getBoard().includes("")) {
                const position = _player2.makeBestMove(gameBoard.getBoard());
                // Update the value in the board
                gameBoard.updateValue(position, _activePlayer.getMarker());
                // Display the marker on the board
                displayController.updateCell(document.getElementById(position.toString()), _activePlayer.getMarker());
                // Switch player
                _switchPlayer();
            }

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

    const setMode = mode => {
        _mode = mode;
    };

    const getMode = () =>  _mode;

    return {
        init,
        startNewGame,
        play,
        getActivePlayer,
        setMode,
        getMode,
        getPlayer1,
        getPlayer2,
    };
})();

gameController.init();