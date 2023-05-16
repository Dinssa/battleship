/*----- classes -----*/
import { BattleShipGame } from './class/Battleship.js';
import { HumanPlayer, ComputerPlayer } from './class/Player.js';
import { HumanBoard, ComputerBoard } from './class/Board.js';
import { HumanShip, ComputerShip } from './class/Ship.js';

/*----- constants -----*/
import * as CONSTANTS from './constants.js';

/*----- state variables -----*/
export let games = [];
export let gameNum = 0;
let scores = {};
let timerInterval;
let minutes;
let seconds;
let playInterval;
let boardSize;
let game;
let playerOne;
let playerTwo;
let playerOneBoard;
let playerTwoBoard;
let playerOneShips;
let playerTwoShips;
let message;
  
/*----- cached elements  -----*/
import { 
    boardOneEl, 
    boardOneMenuEl, 
    boardTwoMenuEl, 
    boardTwoEl, 
    msgEl, 
    playBtn, 
    timerEl, 
    gameIntroEl, 
    boardOneOuterEl,
    boardTwoOuterEl,
    scoreBoardEl
 } from './cached.js';

/*----- event listeners -----*/
playBtn.addEventListener('click', newGame);
document.addEventListener('keydown', e => {
    if (playerOneBoard !== undefined && e.key === 'r') playerOneBoard.toggleOrientation();
});
  
/*----- functions -----*/
init()

function init(){
    // newGame();
    boardSize = 10;
    gameNum = 0;
    // msgEl.innerHTML = "press play to start";

}

function newGame(){
    // gameNum++;  // For multiple games
    gameIntroEl.classList.add('hidden');
    boardOneOuterEl.classList.remove('hidden');
    boardTwoOuterEl.classList.remove('hidden');
    scoreBoardEl.classList.remove('hidden');
    playBtn.classList.add('hidden-inplace');


    const ships = Object.keys(CONSTANTS.SHIPS);
    playerOneBoard = new HumanBoard(boardSize, boardOneEl);
    playerTwoBoard = new ComputerBoard(boardSize, boardTwoEl);
    playerOneShips = ships.map(ship => new HumanShip(ship, playerOneBoard));
    playerTwoShips = ships.map(ship => new ComputerShip(ship, playerTwoBoard));
    playerOne = new HumanPlayer('You');
    playerTwo = new ComputerPlayer('Computer');
    game = new BattleShipGame();

    // TODO: Refactor this
    playerOneBoard.setShips(playerOneShips);
    playerTwoBoard.setShips(playerTwoShips);
    playerOneBoard.setPlayer(playerOne);
    playerTwoBoard.setPlayer(playerTwo);

    playerOne.setBoard(playerOneBoard);
    playerOne.setOpponentBoard(playerTwoBoard);
    playerOne.setShips(playerOneShips);
    playerOne.setGame(game);

    playerTwo.setBoard(playerTwoBoard);
    playerTwo.setOpponentBoard(playerOneBoard);
    playerTwo.setShips(playerTwoShips);
    playerTwo.setGame(game);
    
    games.push(game);
    games[gameNum].init();

    playerOneBoard.init();
    playerTwoBoard.init();
    playerOne.initShips(playerOneShips);
    playerTwoBoard.placeShips();
    renderInit();
    message = "Place your ships";
    render();

    clearInterval(timerInterval);
    minutes = 5;
    seconds = 0;
    clearInterval(playInterval);
    
    inPlay();
}

function inPlay(){
    updateTimer();
    let playOne = true;
    let playTwo = false;
    playInterval = setInterval(() => {
        if (games[gameNum].winner) return;
        
        render();
        if (playerOneBoard.shipsPlaced === 5 && !games[gameNum].inPlay){
            timerInterval = setInterval(updateTimer, 1000);
            games[gameNum].play();
        }

        if (games[gameNum].inPlay){
            if (games[gameNum].turn === 1 && playOne) {
                // Player One's turn ( === 1)
                message = `It's your turn!`;
                playerTwoBoard.enableCells();
                // console.log(playerOne.hits)
                // console.log(playerTwo.hits)
                // if (playerOne.getNumAttacks() > playerTwo.getNumAttacks()) games[gameNum].toggleTurn();
                // console.log('turn: ', games[gameNum].turn)
                // console.log('playerOne: ', playerOne.getNumAttacks())
                // console.log('playerTwo: ', playerTwo.getNumAttacks())
                playOne = false;
                playTwo = true;
            } else if (games[gameNum].turn === -1 && playTwo) {
                // Player Two's turn ( === -1)
                message = `It's ${playerTwo.getName()}'s turn!`;
                playerTwoBoard.disableCells();
                playerTwo.attack();
                playTwo = false;
                playOne = true;
            }
        }

        // games[gameNum].winner = getWinner();
    }, 200);
}

// function getWinner(){
//     return winByTimeOut() || winBySunkShip();
// };

// function winBySunkShip(){
//     let totalShipLengths = Object.values(CONSTANTS.SHIPS).reduce(function (acc, ship) { return acc + ship.length; }, 0);
//     if (playerOne.getHits() === totalShipLengths) return playerOne;
//     if (playerTwo.getHits() === totalShipLengths) return playerTwo;
//     return false;
// }

// function winByTimeOut(){
//     if (minutes === 0 && seconds === 0){
//         console.log('time out')

//         message = "Time's up!";
//         return true;
//     }
//     return false;
// }

function updateTimer(){
    timerEl.innerHTML = (minutes < 10 ? `0${minutes}` : minutes) + ":" + (seconds < 10 ? `0${seconds}` : seconds);
    seconds--;
    if (seconds < 0){
        seconds = 59;
        minutes--;
    }
    if (minutes === 0 && seconds === 0){
        clearInterval(timerInterval);
        timerEl.innerHTML = "00:00";
        // message = "Time's up!";
        return;
    }
}

function renderInit(){
    boardOneMenuEl.style.flexDirection = 'row';
    // playerTwoBoard.initCells();
}

function render(){
    renderMessage();
    playerOneBoard.render();
    playerTwoBoard.render();
}

function renderMessage(){
    if (playerOneBoard.shipsPlaced === 5 && games[gameNum].inPlay) msgEl.innerHTML = message;
}