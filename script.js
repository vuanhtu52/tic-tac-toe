const gameBoard = (() => {
    let _board = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];
    const getBoard = () =>  _board;
    return {
        getBoard,
    };
})();

const displayController = (() => {
    const _createCell = () => {
        let cell = document.createElement("div");
        cell.className = "cell";
        return cell;
    };
    const renderBoard = () => {
        const board = gameBoard.getBoard();
        board.forEach(value => {
            let cell = _createCell();
            cell.textContent = value;
            const boardDiv= document.querySelector(".board");
            boardDiv.appendChild(cell);
        });
    };
    return {
        renderBoard,
    };
})(); 

displayController.renderBoard();