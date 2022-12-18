//Author: Jared Lawson
//Date: 12/16/2022
//Description: Game functions will have game in their name and are meant
//          for functions which control game flow. Otherwise, functions 
//          without game in name will control html

var humanPlayer = 0;
var cpuPlayer;
var playersTurn = true;
var turn = 0;

var results;
var gameBoard = new Array(9).fill(-1);
var gameComputerCheck = document.getElementById('inputCpuMM').checked;
var content = document.getElementById('game-result');
let gameLog = document.getElementById('game-log');

var evalStateCount = 0;
var expandedStateCount = 0;

//sets up game after start game button
function gameStart() {
    //sets up any variables or pieces for game
    gameResetBoard();
    //determine player piece
    gameSetPlayerPiece();
    //determine checked cpu mode
    gameComputerCheck = document.getElementById('inputCpuMM').checked;
    //shuffles the movement order for unique tile plays
    shuffleExpandOrder();
    //enable buttons
    gameEnableButtons()

    //reset results html
    content.style.fontWeight = "normal";
    content.style.color = "black";
    content.innerHTML = "Waiting for results...";

    //reset log html
    gameLog.innerHTML = "";

    //reset stats
    evalStateCount = 0;
    expandedStateCount = 0;
    turn = 0;

    //if player isn't first, call computers turn
    if (!playersTurn) {
        gameComputerTurn();
    }
}


//set playersTurn based on input check
function gameSetTurn(pos) {
    if (pos) {
        playersTurn = false;
    } else {
        playersTurn = true;
    }
}

//sets players piece and players turn based on input check
function gameSetPlayerPiece() {
    //player piece is either X or O
    //0 if it is X
    //1 if it is O
    if (document.getElementById('inputX').checked) {
        humanPlayer = 0;
        cpuPlayer = 1 - humanPlayer;
        gameSetTurn(humanPlayer);
    } else {
        humanPlayer = 1;
        cpuPlayer = 1 - humanPlayer;
        gameSetTurn(humanPlayer);
    }
}

//returns board(s) to blank state
function gameResetBoard() {
    //resets all html buttons
    for (let i = 0; i < 9; i++) {
        document.getElementById('board' + i).innerHTML = "";
    }
    //resets gameBoard to default
    gameBoard = new Array(9).fill(-1);
}

//if was playersTurn, switch to cpu turn
function gameChangeTurn() {
    //doesn't change turns if game is over
    if (!isTerminal(gameBoard)) {
        //log the current turn
        htmlLog();
        //increment the turn
        turn++;
        //flip turn
        playersTurn = !playersTurn;
        //if not players turn, computers turn
        if (!playersTurn) {
            gameComputerTurn();
        }
    } else {
        //log the last turn
        htmlLog();

        //if game is over run end result
        gameEnd()
    }
}


//updates button value
function boardClick(pos) {
    let input = document.getElementById('board' + pos);

    //prevents overwriting spots
    if (input.innerHTML.trim() == "" && playersTurn) {
        //update board html for player
        boardHTML(input, humanPlayer);

        //update board data
        gameBoard[pos] = humanPlayer;

        //changes playersturn only if he can go
        gameChangeTurn();
    }
}

function boardHTML(input, player) {

    if (player) {
        input.innerHTML = 'O';
    } else {
        input.innerHTML = 'X';
    }
}

function gameComputerTurn() {
    //maximum of 9 turns
    //determine results based on checked
    let results;
    if (gameComputerCheck) {
        results = ticMinimax(gameBoard, cpuPlayer, cpuPlayer);
    } else {
        results = ticMinimaxAlphabeta(gameBoard, cpuPlayer, cpuPlayer, -1000, 1000);
    }

    let pos = 0;
    for (let k = 0; k < gameBoard.length; k++) {
        if (gameBoard[k] == -1) {
            pos = k;
            break;
        }
    }
    //update board html for cpu
    boardHTML(document.getElementById('board' + results.move), cpuPlayer);

    //update gameBoard with cpu move
    gameBoard[results.move] = cpuPlayer;

    //update playersturn
    gameChangeTurn();
}

function gameEnd() {
    // -negative is loss, 0 is draw, and +positive is win
    let game = util(gameBoard, humanPlayer);
    let obj = document.createElement("p");

    if (game > 0) {
        //win
        obj.appendChild(document.createTextNode("Human Win! This... shouldn't be possible!"));
        content.style.color = "green";
        content.style.fontWeight = "bold";
        content.innerHTML = obj.textContent;
    } else if (game == 0) {
        //draw
        obj.appendChild(document.createTextNode("Human Draw! You'll never defeat me hahahaha!"));
        content.style.color = "saddlebrown";
        content.style.fontWeight = "bold";
        content.innerHTML = obj.textContent;
    } else {
        //lose
        obj.appendChild(document.createTextNode("Human Lose! This... is only the beginning!"));
        content.style.color = "red";
        content.style.fontWeight = "bold";
        content.innerHTML = obj.textContent;
    }
}

//this function logs each turn of the game
function htmlLog() {
    //write the turn and player
    let log = document.createElement("p");
    log.appendChild(document.createTextNode((playersTurn ? "Player " : "Computer " ) + "Turn: " + (turn + 1) + "\n"));
    gameLog.appendChild(log);

    //write the board
    log = document.createElement("table");
    log.style.borderCollapse = "collapse";

    //add three rows
    log.appendChild(document.createElement("tr"));
    log.appendChild(document.createElement("tr"));
    log.appendChild(document.createElement("tr"));


    //create first child td for table
    let childTD;
    let board = 0;
    console.log(gameBoard[4]);
    for (let l = 0; l < log.children.length; l++) {

        childTD = document.createElement("td");
        childTD.style.width = "40px";
        childTD.style.height = "20px";
        childTD.style.textAlign = "center";
        if (gameBoard[board] >= 0) {
            boardHTML(childTD, gameBoard[board]);
        }
        board++;
        log.children[l].appendChild(childTD);

        childTD = document.createElement("td");
        childTD.style.width = "40px";
        childTD.style.height = "20px";
        childTD.style.textAlign = "center";
        if (gameBoard[board] >= 0) {
            boardHTML(childTD, gameBoard[board]);
        }
        board++;
        log.children[l].appendChild(childTD);

        childTD = document.createElement("td");
        childTD.style.width = "40px";
        childTD.style.height = "20px";
        childTD.style.textAlign = "center";
        if (gameBoard[board] >= 0) {
            boardHTML(childTD, gameBoard[board]);
        }
        board++;
        log.children[l].appendChild(childTD);
    }

    gameLog.appendChild(log);

    //<table id="ui_tictactoe">
    //    <tr>
    //        <td>x</td>
    //        <td>o</td>
    //        <td></td>
    //    </tr>
    //    <tr>
    //        <td></td>
    //        <td></td>
    //        <td></td>
    //    </tr>
    //    <tr>
    //        <td></td>
    //        <td></td>
    //        <td></td>
    //    </tr>
    //</table>
}

function gameEnableButtons() {
    let buttons = document.getElementsByClassName('game-button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}

