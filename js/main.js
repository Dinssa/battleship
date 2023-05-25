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
    scoreBoardEl,
    gameCustomisationAvaterSelectEl
 } from './cached.js';

/*----- event listeners -----*/
playBtn.addEventListener('click', newGame);
document.addEventListener('keydown', e => {
    if (playerOneBoard !== undefined && e.key === 'r') playerOneBoard.toggleOrientation();
});
gameCustomisationAvaterSelectEl.addEventListener('click', setAvatar);
  
/*----- functions -----*/
init()

function init(){
    boardSize = 10;
    gameNum = -1; // Starts at -1 so that newGame() increments to 0
}

function newGame(){
    // * Hide intro screen and show game screen
    gameIntroEl.classList.add('hidden');
    boardOneOuterEl.classList.remove('hidden');
    boardTwoOuterEl.classList.remove('hidden');
    scoreBoardEl.classList.remove('hidden');
    playBtn.classList.add('hidden-inplace');

    // * Initialise game variables
    gameNum++; // Allows for multiple games
    const ships = Object.keys(CONSTANTS.SHIPS); // Array of ship names

    // * Initialise game classes
    playerOneBoard = new HumanBoard(boardSize, boardOneEl);
    playerTwoBoard = new ComputerBoard(boardSize, boardTwoEl);
    playerOneShips = ships.map(ship => new HumanShip(ship, playerOneBoard));
    playerTwoShips = ships.map(ship => new ComputerShip(ship, playerTwoBoard));
    playerOne = new HumanPlayer('You');
    playerTwo = new ComputerPlayer('Computer');
    game = new BattleShipGame();

    // * Set board ships and player
    playerOneBoard.setShips(playerOneShips);
    playerTwoBoard.setShips(playerTwoShips);
    playerOneBoard.setPlayer(playerOne);
    playerTwoBoard.setPlayer(playerTwo);

    // * Set player boards, ships and opponent board
    playerOne.setBoard(playerOneBoard);
    playerOne.setShips(playerOneShips);
    playerOne.setOpponentBoard(playerTwoBoard);
    playerTwo.setBoard(playerTwoBoard);
    playerTwo.setShips(playerTwoShips);
    playerTwo.setOpponentBoard(playerOneBoard);

    // * Add players to game
    game.setPlayerOne(playerOne);
    game.setPlayerTwo(playerTwo);
    
    games.push(game);
    games[gameNum].init();

    // * Initialise boards
    games[gameNum].playerOne.board.init();
    games[gameNum].playerTwo.board.init();

    // * Initialise ships
    games[gameNum].playerOne.initShips();
    games[gameNum].playerTwo.board.placeShips();

    renderInit();
    games[gameNum].changeMessage("Place your ships");
    render();

    // * Clear intervals, new timer and new game (play)
    clearInterval(timerInterval);
    clearInterval(playInterval);

    // * Set game time as 5 minutes
    minutes = 5;
    seconds = 0;
    
    // * Start game
    inPlay();
}

function inPlay(){
    updateTimer(); // Update timer once before setInterval, showing full game time
    let playOne = true; // Boolean to check if player one has played yet, used to alternate turns only after players have played 
    playInterval = setInterval(() => {
        if (games[gameNum].winner) return; // If there is a winner, stop playing
        
        render();

        // * If player one has placed all ships and game is not in play, start game
        if (games[gameNum].playerOne.board.shipsPlaced === 5 && !games[gameNum].inPlay){
            timerInterval = setInterval(updateTimer, 1000);
            games[gameNum].play();
        }

        // * If game is in play, play who's turn it is
        if (games[gameNum].inPlay){
            if (games[gameNum].turn === 1 && playOne) {
                games[gameNum].changeMessage("It's your turn!");
                games[gameNum].playerTwo.board.enableCells();
                playOne = false;
            } else if (games[gameNum].turn === -1 && !playOne) {
                games[gameNum].changeMessage(`It's ${playerTwo.getName()}'s turn!`);
                games[gameNum].playerTwo.board.disableCells();
                games[gameNum].playerTwo.attack();
                playOne = true;
            }
        }
        games[gameNum].winner = getWinner();
        if (games[gameNum].winner !== false && (minutes > 0 || seconds > 0)) games[gameNum].changeMessage(`${games[gameNum].winner.getName()} wins!`);
        if (games[gameNum].winner !== false) games[gameNum].changeMessage(`Time's up! ${games[gameNum].winner.getName()} wins.`);
    }, 200);
}

function getWinner(){
    return winByTimeOut() || winBySunkShip();
};

function winBySunkShip(){
    let totalShipLengths = Object.values(CONSTANTS.SHIPS).reduce(function (acc, ship) { return acc + ship.length; }, 0);
    if (games[gameNum].playerTwo.getHits().length === totalShipLengths) {
        clearInterval(timerInterval);
        return games[gameNum].playerOne;
    }
    if (games[gameNum].playerOne.getHits().length === totalShipLengths) {
        clearInterval(timerInterval);
        return games[gameNum].playerTwo;
    } 
    return false;
}

function winByTimeOut(){
    if (minutes === 0 && seconds === 0){
        console.log('time out')
        games[gameNum].playerTwo.board.disableCells();
        games[gameNum].changeMessage("Time's up!");
        
        if (games[gameNum].playerTwo.getHits().length > games[gameNum].playerOne.getHits().length) {
            return games[gameNum].playerOne;
        } else if (games[gameNum].playerTwo.getHits().length < games[gameNum].playerOne.getHits().length){
            return games[gameNum].playerTwo;
        } else {
            return {getName: () => 'No one'}
        }
    }
    return false;
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

        games[gameNum].changeMessage("Time's up!");
        return;
    }
}

function setAvatar(evt){
    const avatarScoreBoard = document.querySelector('#avatar-scoreboard');
    const avatarPreview = document.querySelector('#avatar-preview');
    const avatar = evt.target;
    avatarScoreBoard.src = `./assets/avatar/${avatar.value}.jpg`;
    avatarPreview.src = `./assets/avatar/${avatar.value}.jpg`;
}

function renderInit(){
    boardOneMenuEl.style.flexDirection = 'row';
    // playerTwoBoard.initCells();
}

function render(){
    games[gameNum].playerOne.board.render();
    games[gameNum].playerTwo.board.render();
}