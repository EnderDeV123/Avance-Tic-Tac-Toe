let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; // Player's turn (O) or AI's turn (X)

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turnO = true; // Reset to player's turn
    enableBoxes();
    msgContainer.classList.add("hide");
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O"; // Player makes a move
            box.disabled = true;
            if (!checkWinner()) {
                turnO = false; // Switch turn to AI
                setTimeout(aiTurn, 1000); // Delay AI's turn by 1 second
            }
        }
    });
});

const aiTurn = () => {
    // Check if AI can win or block player's winning move
    const move = findBestMove();
    if (move !== null) {
        boxes[move].innerText = "X"; // AI makes a move
        boxes[move].disabled = true;
        if (checkWinner()) return;
    }
    turnO = true; // Switch turn back to player
}

const findBestMove = () => {
    // Check if AI can win
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const aVal = boxes[a].innerText;
        const bVal = boxes[b].innerText;
        const cVal = boxes[c].innerText;

        if (aVal === "X" && bVal === "X" && cVal === "") {
            return c; // AI wins
        }
        if (aVal === "X" && cVal === "X" && bVal === "") {
            return b; // AI wins
        }
        if (bVal === "X" && cVal === "X" && aVal === "") {
            return a; // AI wins
        }
    }

    // Block player's winning move
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const aVal = boxes[a].innerText;
        const bVal = boxes[b].innerText;
        const cVal = boxes[c].innerText;

        if (aVal === "O" && bVal === "O" && cVal === "") {
            return c; // Block player
        }
        if (aVal === "O" && cVal === "O" && bVal === "") {
            return b; // Block player
        }
        if (bVal === "O" && cVal === "O" && aVal === "") {
            return a; // Block player
        }
    }

    // Make a random move if no immediate win or block
    const availableBoxes = [...boxes].map((box, index) => (box.innerText === "" ? index : null)).filter(index => index !== null);
    return availableBoxes.length > 0 ? availableBoxes[Math.floor(Math.random() * availableBoxes.length)] : null;
}

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
}

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
                return true; // Winner found
            }
        }
    }
    // Check for a draw
    if ([...boxes].every(box => box.innerText !== "")) {
        msg.innerText = "It's a draw!";
        msgContainer.classList.remove("hide");
        disableBoxes();
        return true;
    }
    return false; // No winner
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
