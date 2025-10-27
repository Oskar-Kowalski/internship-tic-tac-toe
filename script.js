/**
 * Tic Tac Toe Game Logic Blueprint
 *
 * This file provides the initial setup, DOM references, and function signatures.
 * You have to implement the logic inside each function based on the comments provided.
 */

// --- 1. GAME STATE AND INITIAL SETUP ---

// Central object to manage the current state of the game.
const gameState = {
  isGameOver: false,
  winner: null,
  // Notice how we don't track the fields in the game directly because we're referencing the HTML nodes and their values for that with `data-value` attribute
};

// DOM references (selectors)
const cells = document.querySelectorAll(".cell"); // All 9 clickable cell elements
const gameStatus = document.getElementById("gameStatus"); // The message paragraph
const resetButton = document.getElementById("resetButton"); // The reset button
const currentPlayerDisplay = document.getElementById("currentPlayer"); // The current player span

/**
 * CRITICAL LOGIC: Define all possible winning index combinations on the 3x3 board.
 *
 * The board cells are indexed 0 to 8:
 * | 0 | 1 | 2 |
 * | 3 | 4 | 5 |
 * | 6 | 7 | 8 |
 *
 * Interns must create an array of arrays. Each inner array must contain the three indices
 * that form a winning line. There are 8 total winning lines to find:
 * 1. Three Horizontal Rows
 * 2. Three Vertical Columns
 * 3. Two Diagonals
 *
 * For a win, the 'data-value' attribute on all three cells in a combination must be identical and non-empty.
 */
const WINNING_COMBINATIONS = [
  // Example: [0, 1, 2] for the top row is a winning combination. Find the other 7!
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8], 
  [2, 4, 6]  
];



// --- 2. HELPER FUNCTIONS ---

/**
 * Gets the current mark ('X' or 'O') from a specific cell.
 * @param {number} index - The index of the cell (0-8).
 * @returns {string | null} The value of the 'data-value' attribute, or null if empty.
 */
const getCellValue = (index) => {
  // Implementation:
  // 1. Access the correct cell element using the 'cells' NodeList and the 'index'.
  // 2. Use the .getAttribute() method to retrieve the value of 'data-value'.
  const cell = cells[index]; 
  return cell.getAttribute("data-value") || null; 

};



/**
 * Checks if a winning combination exists.
 * @returns {string | null} Returns the winning player ('X' or 'O'), or null if no winner.
 */
const checkWinner = () => {
  // Implementation:
  // 1. Loop through each combination array in WINNING_COMBINATIONS.
  // 2. For each combination [a, b, c], use getCellValue(a), getCellValue(b), and getCellValue(c).
  // 3. Check if the value at 'a' is not null AND if it is equal to the values at 'b' and 'c'.
  // 4. If a match is found, immediately return the winning player's value (e.g., 'X' or 'O').
  // 5. If the loop completes without a match, return null.
  for (const [a, b, c] of WINNING_COMBINATIONS) {
  const vala = getCellValue(a);
  const valb = getCellValue(b);
  const valc = getCellValue(c);

  if (vala && vala === valb && vala === valc) {
    return vala; 
  }
}
return null;
};

/**
 * Checks if every cell on the board has been played.
 * @returns {boolean} True if the board is full, false otherwise.
 */
const isBoardFull = () => {
  // Implementation:
  // 1. Convert the 'cells' NodeList into a true Array using Array.from().
  // 2. Use the .every() array method.
  // 3. Inside the .every() callback, check if the cell element has the 'data-value' attribute (meaning it's filled).
  // 4. Return the result of the .every() check.
  return Array.from(cells).every(cell => cell.getAttribute("data-value"));

};

/**
 * Visually updates a cell on the board by setting its data attribute.
 * NOTE: The CSS uses this attribute to display the 'X' or 'O' and change styling.
 * @param {number} index - The index of the cell (0-8).
 * @param {string} value - The player mark ('X' or 'O').
 */
const updateCellDisplay = (index, value) => {
  // Implementation:
  // 1. Access the correct cell element using 'cells' and 'index'.
  // 2. Use the .setAttribute() method to set 'data-value' to the 'value' parameter.
  const cell = cells[index];
    cell.setAttribute("data-value", value);

};

/**
 * Registers a player's move on the board.
 *
 * IMPORTANT: This is a "wrapper" function. Although it currently only calls updateCellDisplay,
 * its purpose is to create a clean interface for moving. In future development (like adding
 * move logging, advanced validation, or networking features), all that extra logic would
 * be placed here, keeping the main 'handleCellClick' function clean and focused on user interaction.
 *
 * @param {number} index - The index of the cell (0-8).
 * @param {string} player - The player mark ('X' or 'O').
 */
const makeMove = (index, player) => {
  // Implementation:
  // 1. This function is a simple wrapper. Call updateCellDisplay(index, player).
  updateCellDisplay(index, player);
};

// --- 3. CORE GAME LOGIC ---

/**
 * Determines and executes the computer's move ('O').
 * The computer plays randomly on an empty cell.
 */
const computerMove = () => {
  // Implementation:
  // 1. Create an array of indices of all currently empty cells. (Hint: Use Array.from(cells) and .map()/.filter(), checking for the absence of 'data-value').
  // 2. If the empty cells array is length 0, return immediately.
  // 3. Select a random index from the empty cells array (Hint: Math.random() and Math.floor()).
  // 4. Call makeMove() to place the computer's mark ('O') on that random index.
  const emptyIndices = Array.from(cells)
  .map((cell, ind) => (cell.getAttribute("data-value") ? null : ind))
  .filter((val) => val !== null);
  if(emptyIndices.length === 0) return;

  const randIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randIdx, "O");
};

/**
 * Updates the visual status message (below the board).
 */
const updateGameStatus = () => {
  // Implementation:
  // 1. Check if gameState.winner is truthy.
  //    - If true, set gameStatus.textContent to announce the winner (e.g., "Player X wins!") and add the 'winner' class.
  // 2. ELSE IF check if isBoardFull() is true.
  //    - If true, set gameStatus.textContent to announce a draw (e.g., "It's a draw!") and add the 'draw' class.
  // 3. ELSE (Game is ongoing):
  //    - Set gameStatus.textContent to a general message (e.g., "Your turn!").
  //    - Ensure 'winner' and 'draw' classes are removed from gameStatus.
  if (gameState.winner) {
    gameStatus.textContent = `Player ${gameState.winner} wins!`;
    gameStatus.classList.add("winner");
    gameStatus.classList.remove("draw");
  } else if (isBoardFull()) {
    gameStatus.textContent = "It's a draw!";
    gameStatus.classList.add("draw");
    gameStatus.classList.remove("winner");
  } else {
    gameStatus.textContent = "Your turn!";
    gameStatus.classList.remove("winner", "draw");
  }

};

/**
 * Checks for a win or a draw and handles game conclusion.
 * @returns {boolean} True if the game has ended, false otherwise.
 */
const checkGameEnd = () => {
  // Implementation:
  // 1. Call checkWinner() and store the result in a local variable (e.g., 'winner').
  // 2. IF 'winner' is found:
  //    - Set gameState.isGameOver to true and gameState.winner to the 'winner'.
  //    - Loop through all 'cells' and add the 'game-over' class (to visually disable clicks).
  //    - Call updateGameStatus().
  //    - Return true.
  // 3. IF isBoardFull() is true:
  //    - Set gameState.isGameOver to true.
  //    - Call updateGameStatus().
  //    - Return true.
  // 4. Otherwise, return false.
  const winner = checkWinner();
  if(winner) {
    gameState.isGameOver = true;
    gameState.winner = winner;
    cells.forEach(cell => cell.classList.add("game-over"));
    updateGameStatus();
    return true;
  }

  if( isBoardFull()){
    gameState.isGameOver = true;
    gameState.winner = null;
    updateGameStatus();
    return true;
  }

  return false;
};

/**
 * The main event handler for when a player clicks a cell.
 * @param {number} index - The index of the clicked cell.
 */
const handleCellClick = (index) => {
  // Implementation:
  // 1. EARLY EXIT: Check if gameState.isGameOver is true OR if the cell at 'index' already has a value (use getCellValue()). If either is true, return immediately.
  // 2. PLAYER MOVE: Call makeMove(index, "X").
  // 3. CHECK END (Player): Call checkGameEnd(). If it returns true, return immediately (game is over).
  // 4. UI UPDATE: Set gameStatus.textContent to a "thinking" message. Update currentPlayerDisplay.textContent to 'O'.
  // 5. ASYNCHRONOUS COMPUTER MOVE (Use setTimeout):
  //    - Set a 1000ms delay.
  //    - Inside the delay, call computerMove().
  //    - After computerMove, call checkGameEnd().
  //    - If the game is NOT over, reset gameStatus.textContent and set currentPlayerDisplay.textContent back to 'X'.
  if (gameState.isGameOver || getCellValue(index)) return;

  makeMove(index, "X");

  if (checkGameEnd()) return;

  gameStatus.textContent = "thinking";
  currentPlayerDisplay.textContent = "O";

  setTimeout(() => {
    computerMove();
    if (checkGameEnd()) return;
    gameStatus.textContent = "Your turn!";
    currentPlayerDisplay.textContent = "X";
  }, 1000);
};

/**
 * Resets the entire board and game state for a new game.
 */
const resetGame = () => {
  // Implementation:
  // 1. Reset gameState: Set isGameOver to false, winner to null.
  // 2. Clear all cells: Loop through 'cells' NodeList. For each cell, use .removeAttribute('data-value') and .classList.remove('game-over').
  // 3. Reset status message: Set gameStatus.textContent to "Click any cell to start!" and remove the 'winner' and 'draw' classes.
  // 4. Ensure currentPlayerDisplay.textContent is set to 'X'.
  gameState.isGameOver = false;
  gameState.winner = null;
  cells.forEach(cell => {
    cell.removeAttribute("data-value");
    cell.classList.remove("game-over");
  });
  gameStatus.textContent = "Click any cell to start!";
  gameStatus.classList.remove("winner", "draw");
  currentPlayerDisplay.textContent = "X";
};

// --- 4. EVENT LISTENERS ---

// 1. Attach the handleCellClick function to every cell element.
cells.forEach((cell, index) => {

  // Implementation:
  // Use .addEventListener('click', ...) and ensure you pass the correct 'index' to handleCellClick.
  cell.addEventListener("click", () => handleCellClick(index));
});

// 2. Attach the resetGame function to the reset button.
resetButton.addEventListener("click", resetGame);