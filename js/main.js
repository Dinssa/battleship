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
  
/*----- cached elements  -----*/
import { boardOneEl, boardOneMenuEl, boardTwoMenuEl, boardTwoEl, msgEl, playBtn, timerEl } from './cached.js';

/*----- event listeners -----*/
playBtn.addEventListener('click', newGame);
document.addEventListener('keydown', e => {
    if (playerOneBoard !== undefined) playerOneBoard.toggleOrientation();
});
  
/*----- functions -----*/
init()

function init(){
    // newGame();
    boardSize = 10;
    gameNum = 0;
    msgEl.innerHTML = "press play to start a new game";

}

function newGame(){
    // gameNum++;  // For multiple games
    const ships = Object.keys(CONSTANTS.SHIPS);
    playerOneBoard = new HumanBoard(boardSize, boardOneEl);
    playerTwoBoard = new ComputerBoard(boardSize, boardTwoEl);
    playerOneShips = ships.map(ship => new HumanShip(ship, playerOneBoard));
    playerTwoShips = ships.map(ship => new ComputerShip(ship, playerTwoBoard));
    playerOneBoard.setShips(playerOneShips);
    playerTwoBoard.setShips(playerTwoShips);
    playerOne = new HumanPlayer('You');
    playerTwo = new ComputerPlayer('Computer');
    game = new BattleShipGame();
    
    games.push(game);
    games[gameNum].init();

    playerOneBoard.init();
    playerTwoBoard.init();
    playerOne.initShips(playerOneShips);
    playerTwoBoard.placeShips();
    renderInit();
    render();

    clearInterval(timerInterval);
    minutes = 5;
    seconds = 0;
    clearInterval(playInterval);
    
    inPlay();
}

function inPlay(){
    updateTimer();
    playInterval = setInterval(() => {
        if (games[gameNum].winner) return;
        render();
        if (playerOneBoard.shipsPlaced === 5 && !games[gameNum].inPlay){
            timerInterval = setInterval(updateTimer, 1000);
            games[gameNum].play();
        }
    }, 200);
}

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
        msgEl.innerHTML = "Time's up!";
        return;
    }
}

function renderInit(){
    boardOneMenuEl.style.flexDirection = 'row';
    playerTwoBoard.initCells();
}

function render(){
    renderMessage();
    playerOneBoard.render();
    playerTwoBoard.render();
}

function renderMessage(){
    if (playerOneBoard.shipsPlaced === 5 && games[gameNum].inPlay) msgEl.innerHTML = "Launch your attack!";
}