//Author: Jared Lawson
//Date: 12/16/2022
//Description: tictactoe computer methods of expanding states

//Different ordering for expansion of states of game
let moveExpandOrder = [8, 1, 7, 6, 2, 3, 5, 4, 0];
let ROW = 3, COL = 3;
let MAX = 1000, MIN = -1000;

//shuffles the moveExpandOrder every game so you don't end up with the same game everytime
function shuffleExpandOrder() {
    for (var i = moveExpandOrder.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = moveExpandOrder[i];
        moveExpandOrder[i] = moveExpandOrder[j];
        moveExpandOrder[j] = temp;
    }
}

//determines if game is over
function isTerminal(board) {
    ++evalStateCount;

    let answer = false;

    //test if 0(X) is across board
    //test if 1(O) is across board
    for (let j = 0; j < 2; j++) {
        //check the 8 possible win conditions for X then O
        //board across the rows
        //board down the columns
        //boards diagonally 
        if (j == board[0] && j == board[4] && j == board[8]) {
            answer = true
        }

        if (j == board[3] && j == board[4] && j == board[5]) {
            answer = true
        }

        if (j == board[6] && j == board[4] && j == board[2]) {
            answer = true
        }

        if (j == board[1] && j == board[4] && j == board[7]) {
            answer = true
        }

        if (j == board[0] && j == board[1] && j == board[2]) {
            answer = true
        }

        if (j == board[2] && j == board[5] && j == board[8]) {
            answer = true
        }

        if (j == board[6] && j == board[7] && j == board[8]) {
            answer = true
        }

        if (j == board[0] && j == board[3] && j == board[6]) {
            answer = true
        }
    }

    let nums = 0;
    if (!answer) {
        //check for number of empty board spaces
        for (let i = 0; i < 9; i++) {
            if (board[i] == -1) {
                nums++;
            }
        }

        //if number of empty spaces is zero, draw
        if (nums == 0) {
            answer = true;
        }
    }

    //true if the game is finished (i.e, a draw or someone has won)
    //false if the game is incomplete
    return answer;
}

//scores a particular board
function util(board, player) {
    //Return the utility score for board, with respect to the indicated player
    //score of 0 if the board is a draw
    //positive score for wins, negative for losses.
    //larger scores for winning quickly or losing slowly

    //check number of empty board spaces
    var nums = 0;
    for (let i = 0; i < 9; i++) {
        if (board[i] == -1) {
            nums++;
        }
    }
    var answer = 0;
    var win = false;
    var boardWin = -1;

    for (let j = 0; j < 2; j++) {
        //check the 8 possible win conditions for X then O
        if (j == board[0] && j == board[4] && j == board[8]) {
            win = true
        } else if (j == board[3] && j == board[4] && j == board[5]) {
            win = true
        } else if (j == board[6] && j == board[4] && j == board[2]) {
            win = true
        } else if (j == board[1] && j == board[4] && j == board[7]) {
            win = true
        } else if (j == board[0] && j == board[1] && j == board[2]) {
            win = true
        } else if (j == board[2] && j == board[5] && j == board[8]) {
            win = true
        } else if (j == board[6] && j == board[7] && j == board[8]) {
            win = true
        } else if (j == board[0] && j == board[3] && j == board[6]) {
            win = true
        }

        if (win) {
            boardWin = j;
        }

        win = false;
    }

    //neither player won and number of moves left is zero
    if (boardWin == -1 && nums == 0) {
        //board is draw
        answer = 0;
    } else if (boardWin == player) {
        //boardWinner is the player
        answer = nums + 1;
    } else if (boardWin != player) {
        //boardWinner is not the player
        answer = -nums - 1;
    }

    return answer;
}

//minimax algorithm
function ticMinimax(board, cpu, cur) {
    //board [[0,1,2],[3,4,5],[6,7,8]] = [0,1,2,3,4,5,6,7,8]
    //For each board location, use the following:
    //-1 if this space is blank
    //0 if it is X
    //1 if it is O
    //cpu_player: piece computer designated to play
    //cur_player: piece currently playing
    //read above for piece set
    let resultsArray = new Array();
    let returnResult;

    //BASE CASE
    if (isTerminal(board)) {//stop if game is over
        return {
            move: null,
            score: util(board, cpu) //score = how bad/good
        }
    }

    ++expandedStateCount;
    //generate states
    for (let move of moveExpandOrder) { //for each possible move
        if (board[move] != -1) continue; //can't move here

        let newBoard = board.slice(0); //Copy
        newBoard[move] = cur; //Apply move
        //Successor state: new_board

        //recurse
        let results = ticMinimax(newBoard, cpu, 1 - cur);

        returnResult = results;
        returnResult.move = move;

        resultsArray.push(returnResult);

    }

    for (let i = 0; i < resultsArray.length; i++) {
        //check for which X O is moving
        if (cur == 0) {
            //cpu is the x
            if (cpu == cur) {
                if (resultsArray[i].score > returnResult.score) {
                    returnResult = resultsArray[i];
                }

            } else {
                //player is the x
                if (resultsArray[i].score < returnResult.score) {
                    returnResult = resultsArray[i];
                }
            }
        } else {
            //cpu is the o
            if (cpu == cur) {
                if (resultsArray[i].score > returnResult.score) {
                    returnResult = resultsArray[i];
                }
            } else {
                //player is the o
                if (resultsArray[i].score < returnResult.score) {
                    returnResult = resultsArray[i];
                }
            }
        }
    }

    //score: The best score that can be gotten from the provided game state
    //move: The move (location on board) to get that score
    return {
        move: returnResult.move,
        score: returnResult.score
    };
}

//minimax algorithm with alpha beta pruning
function ticMinimaxAlphabeta(board, cpu, cur, alpha, beta) {
    //board [[0,1,2],[3,4,5],[6,7,8]] = [0,1,2,3,4,5,6,7,8]
    //For each board location, use the following:
    //-1 if this space is blank
    //0 if it is X
    //1 if it is O
    //cpu_player: piece computer designated to play
    //cur_player: piece currently playing
    //read above for piece set
    let resultsArray = new Array();
    let returnResult;
    let best;

    //check for which X O is moving
    if (cur == cpu) {
        best = MIN;
    } else {
        best = MAX;
    }

    //BASE CASE
    if (isTerminal(board)) {//Stop if game is over
        return {
            move: null,
            score: util(board, cpu) //How good was this result for us?
        }
    }

    ++expandedStateCount; //DO NOT REMOVE
    //generate states
    for (let move of moveExpandOrder) { //for each possible move
        if (board[move] != -1) continue; //can't move here

        let newBoard = board.slice(0); //Copy
        newBoard[move] = cur; //Apply move

        //recursion
        var results = ticMinimaxAlphabeta(newBoard, cpu, 1 - cur, alpha, beta);

        returnResult = results;
        returnResult.move = move;

        resultsArray.push(returnResult);

        //calculate alpha on cpu turn, beta on player turn
        //max-ing cpu, min-ing player
        if (cur == cpu) {
            best = Math.max(best, results.score);
            alpha = Math.max(alpha, best);
        } else {
            best = Math.min(best, results.score);
            beta = Math.min(beta, best);
        }

        if (alpha > beta) {
            break;
        }

    }

    for (let i = 0; i < resultsArray.length; i++) {
        //check for which X O is moving
        if (cur == 0) {
            //cpu is the x, max/alpha
            if (cpu == cur) {
                if (resultsArray[i].score > returnResult.score) {
                    returnResult = resultsArray[i];
                }

            } else {
                //player is the x, min/beta
                if (resultsArray[i].score < returnResult.score) {
                    returnResult = resultsArray[i];
                }
            }
        } else {
            //cpu is the o, max/alpha
            if (cpu == cur) {
                if (resultsArray[i].score > returnResult.score) {
                    returnResult = resultsArray[i];
                }
            } else {
                //player is the o, min/beta
                if (resultsArray[i].score < returnResult.score) {
                    returnResult = resultsArray[i];
                }
            }
        }
    }

    //score: The best score that can be gotten from the provided game state
    //move: The move (location on board) to get that score
    return {
        move: returnResult.move,
        score: returnResult.score
    };
}

//function checkBoard(board) {
//    let answer = false;
//    //check board across (rows)
//    //check board down (cols)
//    //check board diagonally
//    //all these conditions are based on num of rows x cols, and size of connections

//    //check across (rows)
//    for (let a = 0; a < ROW; a++) {
//        if (board[a * ROW] == board[a * ROW + 1] == board[a * ROW + 2]) {
//            answer = true;
//        }
//    }

//    //check down (cols)
//    for (let b = 0; b < COL; b++) {
//        if (board[b] == board[b + COL] == board[b + COL * 2])
//    }

//    //check diagonals
//    for (let c = 0; c < ; c++) {

//    }

//    //true if there is win condition
//    //false if no win condition
//    return answer;
//}