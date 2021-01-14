let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext('2d');
let x = canvas.width/2;
let y = canvas.height-30;
let turn = 1;
let win = false;

let rWins = 0;
let yWins = 0;

// 1 is Yellow
// 2 is Red
let gameBoard = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

let previousMoves = []
let previousGames = []


function drawGameBoard(height, width) {
    ctx.beginPath();
    ctx.rect(0,0, width + 80, height + 90);
    ctx.fillStyle = "#247bc2";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    circleHeight = 100;
    circleWidth = 100;
    for (i=0; i < 6; i++){
        yPos = circleHeight / 2 + 10*i + circleHeight*i + 10;
        
        for (t=0; t < 7; t++){
            xPos = 10*t + circleWidth*t + circleWidth/2 + 10;
            ctx.beginPath();
            ctx.arc(xPos, yPos, circleWidth/2,  0,2*Math.PI);
            if (gameBoard[i][t] === 1){
                ctx.fillStyle = "#ffff1d";
                ctx.fill();
            } 
            else if (gameBoard[i][t] === 2) {
                ctx.fillStyle = "#ff0000";
                ctx.fill();
            }
            else {
                ctx.fillStyle = "#ffffff";
                ctx.fill();
            }
            ctx.fill(); 
            ctx.stroke();           
            ctx.closePath();

        }
    }

}

function checkIfFour() {
    for (row = 0; row < 6; row++) {
        for (col = 0; col < 7; col++) {
            color = gameBoard[row][col];
            horizontal = [
                [row, col],
                [row, col + 1],
                [row, col + 2],
                [row, col + 3]
            ];
            vertical = [
                [row, col],
                [row + 1, col],
                [row + 2, col],
                [row + 3, col]
            ];
            positiveDiagonal = [
                [row, col],
                [row + 1, col + 1],
                [row + 2, col + 2],
                [row + 3, col + 3]
            ];
            negativeDiagonal = [
                [row, col],
                [row + 1, col - 1],
                [row + 2, col - 2],
                [row + 3, col - 3]
            ];
            if (color != 0) {
                
                horizontalVal = checkList(horizontal, color);
                verticalVal = checkList(vertical, color);
                positiveDiagonalVal = checkList(positiveDiagonal, color);
                negativeDiagonalVal = checkList(negativeDiagonal, color);
                if (horizontalVal || verticalVal || positiveDiagonalVal || negativeDiagonalVal) {
                    return color;
                }
            }
        }
    }
    return false;
}

function onBoard(val) {
    if (val[0] >= 6 || val[0] < 0 || val[1] >= 7 || val[1] < 0) {
        return false;
    } else {
        return true;
    }
}

function checkList(list, color) {
    for (i = 0; i < 4; i++) {
        t = onBoard(list[i]);
        if (t) {
            if (gameBoard[list[i][0]][list[i][1]] != color) {
                return false;
            }
        } else {
            return false;
        }
    }

    return true;
}

function takeBackMove() {
    if (previousMoves.length != 0) {
        lastMove = previousMoves[previousMoves.length - 1];
        lastColor = lastMove[0];
        lastPosition = lastMove[1];
        gameBoard[lastPosition[0]][lastPosition[1]] = 0;
        turn = lastColor;
        switch (turn) {
            case 1:
                document.getElementById("text").textContent = "Yellow's Turn";
                break;
            case 2:
                document.getElementById("text").textContent = "Red's Turn";
                break;
        }
        previousMoves.pop()
        win = checkIfFour();
        document.getElementById("description").textContent = "";
    }
}

function move(column, color) {
    let col = [];
    for (i = 0; i < 6; i++) {
        for (t = 0; t < 7; t++) {
            if (t === column) {
                col.push(gameBoard[i][t]);
            }
        }
    }

    for (e = col.length - 1; e >= 0; e--) {
        if (col[e] == 0) {
            gameBoard[e][column] = color;
            previousMoves.push([color, [e, column]]);
            switch (turn) {
                case 1:
                    turn = 2;
                    document.getElementById("text").textContent = "Red's Turn";
                    break;
                case 2:
                    turn = 1;
                    document.getElementById("text").textContent = "Yellow's Turn";
                    break;
            }
            return;     
        }
    }
}



function findClickLocation(event){
    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let circleWidth = 100;
    
        
    for (t=0; t < 7; t++) {
        startPos = 10*t + circleWidth*t + 10;
        endPos = 10*(t+1) + circleWidth*(t+1) + 10;
        if (startPos <= x && endPos >= x) {
            return t;
        }
    }
    return -1;
}

function shouldMove(e) {
    l = findClickLocation(e);
    if (l != -1) {
        move(l, turn);
    }
}


function reset(){
    previousGames.push(previousMoves)
    gameBoard = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    document.getElementById("description").textContent = "";
    switch (win) {
        case 1:
            turn = 2;
            document.getElementById("text").textContent = "Red's Turn";
            break;
        case 2:
            turn = 1;
            document.getElementById("text").textContent = "Yellow's Turn";
            break;
    }
    win = false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGameBoard(600, 700);
    if (win != false) {
        if (win === 1) {
            console.log("Yellow Wins!");
            document.getElementById("text").textContent = "Yellow Wins!";
            
        } else if (win === 2) {
            console.log("Red Wins!");
            document.getElementById("text").textContent = "Red Wins!";
        }
        document.getElementById("description").textContent = "Click the Reset button to Reset";
        document.getElementById("redWins").textContent = "Red Wins: " + rWins;
        document.getElementById("yellowWins").textContent = "Yellow Wins: " + yWins;
    }
}



canvas.addEventListener("mousedown", function(e) 
        { 
            if (win === false) {
                shouldMove(e);
                s = checkIfFour();
                if (s != false) {
                    win = s;
                    switch (s) {
                        case 1:
                            yWins += 1;
                            break;
                        case 2:
                            rWins += 1;
                            break;
                    }
            }
            }
        }); 



setInterval(draw, 10);
