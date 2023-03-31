let numBoard;
let score = 0;
let highScore = 0;
let scoreField = document.getElementById("score");
let highScoreField = document.getElementById("high-score");
let gameBoard = document.getElementById("board");
let winLoseBox = document.getElementById("win-lose");
let newGameButton = document.getElementById("new-game-button");
let directionsButton = document.getElementById("directions-button");
let directionsBox = document.getElementById("directions");

function displayDirections() {
    if (directionsBox.style.opacity == 0) {
        directionsBox.style.opacity = 1;
    }
    else {
        directionsBox.style.opacity = 0;
    }
}

function resetBoard() {
    numBoard = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    score = 0;
    winLoseBox.innerText = "";
    spawnTile();
    spawnTile();
    displayBoard();
}

function displayBoard() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let curTile = document.getElementById(`t${i}-${j}`);

        curTile.innerText = +numBoard[i][j];
            if(numBoard[i][j] === 0) {
                curTile.innerText = "";
            }

            curTile.className = `tile t${curTile.innerText}`;

            if (curTile.innerText >=8192) {
                curTile.className = "tile t8192"
            }
        }
    }
    scoreField.innerText = +score;
    highScoreField.innerText = +highScore;
}

function isPossibleMove() {
    if (freeSpaceExists()) {
        return true;
    }
    else {
        for (let i= 0; i < 4; i++){
            for(let j = 0; j < 3; j++) {
                if (numBoard[i][j] === numBoard[i][j+1]) {
                    return true;
                }
                if (numBoard[j][i] === numBoard[j+1][i]) {
                    return true;
                }
            }
        }
        return false;
    }
}

function freeSpaceExists() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (numBoard[i][j] === 0) {
                return true;
            }
        }
    }
    return false;
}

function isWinner() {
    let tiles = document.getElementsByClassName("tile");
    for (let tile of tiles) {
        if (+tile.innerText >= 2048) {
            return true;
        }
    }
    return false;
}

function getRandomCoordinates() {
    let p1 = Math.floor(Math.random() * 4);
    let p2 = Math.floor(Math.random() * 4);

    return [p1, p2];
}

function spawnTile() {
    let randCoordinates = getRandomCoordinates();
    let randRow = randCoordinates[0];
    let randCol = randCoordinates[1];
    let isFreeSpace = false;

    for (let  i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (numBoard[i][j] === 0) {
                isFreeSpace = true;
                break;
            }
        }
    }

    if (isFreeSpace === false) {
        return;
    }
    else {
        let found = false;
        while (!found) {
            randCoordinates = getRandomCoordinates();
            randRow = randCoordinates[0];
            randCol = randCoordinates[1];

            if (numBoard[randRow][randCol] === 0) {
                found = true;
            }
        }

        numBoard[randRow][randCol] = (Math.floor(Math.random() * 2 + 1) * 2);
    }
    displayBoard();
}

//helper function to compare two arrays, used to check if there was a move
function compareArrays(arr1, arr2) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (arr1[i][j] !== arr2[i][j]) {
                return false;
                break;
            }
        }
    }
    return true;
}

function handleKeyPress(event) {
    let beforeArray = [];
    for (let row of numBoard) {
        beforeArray.push([...row]);
    }

    if (event.key === "ArrowLeft") {
        moveLeft();
    }
    else if (event.key === "ArrowRight"){
        moveRight();
    }
    else if (event.key === "ArrowUp") {
        moveUp();
    }
    else if (event.key === "ArrowDown") {
        moveDown();
    }

    displayBoard();

    if (isWinner()) {
        winLoseBox.innerText = "You Win!\n Feel free to keep playing and beat that high score!";
    }

    if (compareArrays(beforeArray, numBoard) === false) {
        if (freeSpaceExists()) {
            spawnTile();
        }
    }

    if (isPossibleMove() === false) {
        winLoseBox.innerText = 'Game Over!\nClick "NewGame" to try again!';
    }
}

function moveRow(arr) {
    arr = arr.filter(num => num !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i+1]) {
            arr[i] += arr[i+1];
            arr[i+1] = 0;

            score += arr[i];
            if (score > highScore) {
                highScore = score;
            }
        }
    }

    arr = arr.filter(num => num !== 0);

    while (arr.length < 4) {
        arr.push(0);
    }

    return arr;
}

function moveLeft() {
    for (let i = 0; i< 4; i++) {
        numBoard[i] = moveRow(numBoard[i]);
    }
}

function moveRight() {
    for (let i = 0; i < 4; i++) {
        numBoard[i] = moveRow(numBoard[i].reverse()).reverse();
    }
}

function moveUp() {
    for (let i = 0; i < 4; i++) {
        let tempArr = [];

        for (let j = 0; j < 4; j++) {
            tempArr.push(numBoard[j][i]);
        }

        tempArr = moveRow(tempArr);

        for (let j = 0; j < 4; j++) {
            numBoard[j][i] = tempArr[j];
        }
    }
}

function moveDown() {
    for (let i = 0; i < 4; i++) {
        let tempArr = [];

        for (let j = 0; j < 4; j++) {
            tempArr.push(numBoard[j][i]);
        }

        tempArr = moveRow(tempArr.reverse()).reverse();

        for (let j = 0; j < 4; j++) {
            numBoard[j][i] = tempArr[j];
        }
    }
}

for (let i =0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        let curTile = document.createElement("div");
        curTile.className = "tile";

        curTile.id = `t${i}-${j}`;
        gameBoard.append(curTile);
    }
}

resetBoard();

document.addEventListener("keyup", handleKeyPress);
newGameButton.addEventListener("click", resetBoard);
directionsButton.addEventListener("click", displayDirections);