/*----- constants -----*/
const SHIPS = {
    'carrier': {
        'length': 5,
        'color': '66, 12, 20',
        'img': ''
        },
    'battleship': {
        'length': 4,
        'color': '23, 163, 152',
        'img': ''
    },
    'cruiser': {
        'length': 3,
        'color': '161, 134, 158',
        'img': ''
    },
    'submarine': {
        'length': 3,
        'color': '238, 202, 129',
        'img': ''
    },
    'destroyer': {
        'length': 2,
        'color': '139, 158, 46',
        'img': ''
    }
}

/*----- state variables -----*/
let game;
let games = [];
let gameNum = 0;
let scores = {};
let timerInterval;
let minutes;
let seconds;
let playInterval;
  
/*----- cached elements  -----*/
const boardOneEl = document.getElementById('board-one-inner');
const boardOneMenuEl = document.getElementById('board-one-menu');
const boardTwoEl = document.getElementById('board-two-inner');
const msgEl = document.querySelector('#message>p');
const playBtn = document.querySelector('#controls>button');
const timerEl = document.getElementById('timer');

/*----- event listeners -----*/
playBtn.addEventListener('click', init);

/*----- classes -----*/
class Cell {
    constructor(domElement) {
        this.domElement = domElement;
        this.value = 'empty';
        this.shipName = '';
        this.renderLookup = {
            'empty': 'white',
            'ship' : 'navy',
            'hit'  : 'orange',
            'miss' : 'lightgrey',
            'sunk' : 'red'
        }
    }

    setShip(shipName){
        this.shipName = shipName;
        this.renderLookup.ship = `rgb(${SHIPS[shipName].color})`;
    }

    render(){
        this.domElement.style.backgroundColor = this.renderLookup[this.value];
    }
}

// class GraphicalCell extends Cell {

// }

class Board {
    constructor(boardSize, boardElement, ships){
        this.size = boardSize;
        this.boardElement = boardElement;
        this.cellEls = [];
        this.ships = ships;
        this.shipsPlaced = 0;
        this.currentShip = null;
        this.currentShipMousePosition = null;
    }

    init(){
        this.initBoard();
        this.initShips();
    }

    initBoard(){
        this.boardElement.innerHTML = '';
        for(let i = 0; i < this.size; i++){
            const row = document.createElement('div');
            row.classList.add('row');
            for(let j = 0; j < this.size; j++){
                const cell = new Cell(document.createElement('div'));
                this.cellEls.push(cell);
                cell.domElement.classList.add('cell');
                cell.domElement.dataset.xy = `${j}-${i}`;
                row.append(cell.domElement);
            }
            this.boardElement.append(row);
        }
    }

    initShips(){
        boardOneMenuEl.innerHTML = '';
        this.ships.forEach(ship => ship.render());
    }

    // handleAttack(evt){
    //     const cell = evt.target;
    //     const idx = cell.dataset.xy;
    //     console.log(idx);
    //     console.log(this.cellEls)
    //     if (idx === undefined) return;
    // }

    render(){
        this.cellEls.forEach(cell => cell.render());
    }
}

class HumanBoard extends Board {
    constructor(boardSize, boardElement, ships){
        super(boardSize, boardElement, ships);
        // console.log(this)
        this.boardElement.addEventListener('dragenter', this.handleDragEnter.bind(this));
        this.boardElement.addEventListener('dragover', this.handleDragOver.bind(this));
        this.boardElement.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.boardElement.addEventListener('drop', this.handleDragDrop.bind(this));
        this.cellsBelow = [];
    }
    
    highlightCells(cell){
        // cell.classList.add('hover');
        let ship = games[gameNum].playerOne.board.ships.find(ship => ship.name === games[gameNum].playerOne.board.currentShip);
        console.log(ship)
        let shipMousePosition = games[gameNum].playerOne.board.currentShipMousePosition;
        // console.log(shipMousePosition);
        let cellPosition = cell.dataset.xy.split('-');
        // console.log(cellPosition)
        let cellX = parseInt(cellPosition[0]);
        let cellY = parseInt(cellPosition[1]);
        this.cellsBelow = [];
        this.cellsBelow.push(cell.dataset.xy);
        if (ship.orientation === 'vertical'){
            for (let i = ship.length - shipMousePosition; i > 0; i--){
                if (cellY + i > 9) return; // Guard: if ship is too long to fit on board
                this.cellsBelow.push(`${cellX}-${cellY + i}`)
            }
            for (let i = shipMousePosition - 1; i > 0; i--){
                if (cellY - i < 0) return; // Guard: if ship is too long to fit on board
                this.cellsBelow.push(`${cellX}-${cellY - i}`)
            }
            console.log(this.cellsBelow)
        } else {

        }

        this.cellsBelow.forEach(xy => document.querySelector(`[data-xy="${xy}"]`).classList.add('hover'))
        // console.log(shipLength);
        // console.log(shipOrientation);
        // console.log(SHIPS[games[gameNum].playerOne.board.currentShip].length)
        // console.log(cell.dataset.xy)
    }

    unHighlightCells(cell){
        let boardCellEls = document.querySelectorAll('#board-one-inner > .row > .cell');
        boardCellEls.forEach(cell => (!this.cellsBelow.includes(cell.dataset.xy)) ? cell.classList.remove('hover') : null);
        // console.log(boardCellEls);
    }

    placeShip(cell){
        let ship = games[gameNum].playerOne.board.ships.find(ship => ship.name === games[gameNum].playerOne.board.currentShip);
        console.log('place ship')
        console.log(ship)
        console.log(ship.orientation)
        console.log(cell)
        console.log(this.cellsBelow)
        ship.positionArray = this.cellsBelow;
        ship.render();
        // if (ship.orientation === 'vertical'){
        //     let placeShipAt = this.cellsBelow.reduce((acc, xy) => {
        //         let y = parseInt(xy.split('-')[1]);
        //         return (y < acc.y) ? {xy: xy, y: y} : acc;
        //     }, {xy: '', y: Infinity});
        //     ship.startPos = placeShipAt.xy;
        //     ship.render();
        //     console.log(placeShipAt.xy)
        // } else {
        // }
    }

    handleDragEnter(evt){
        evt.preventDefault();
        const cell = evt.target;
        // console.log('handle drag enter')
        this.highlightCells(cell);
    }

    handleDragOver(evt){
        evt.preventDefault();
        // const cell = evt.target;
        // console.log('handle drag over')
        // cell.classList.add('hover');
    }

    handleDragLeave(evt){
        evt.preventDefault();
        // console.log('handle drag leave')
        const cell = evt.target;
        this.unHighlightCells(cell);
    }

    handleDragDrop(evt){
        evt.preventDefault();
        // console.log('handle drag drop')
        const cell = evt.target;
        this.placeShip(cell);
        // const shipName = evt.dataTransfer.getData('text/plain');
        // console.log(shipName);
        console.log(cell.dataset.xy)
    }

}

class ComputerBoard extends Board {
    constructor(boardSize, boardElement, ships){
        super(boardSize, boardElement, ships);
        // this.boardElement.addEventListener('click', this.handleAttack.bind(this));
    }

    render(){
        this.cellEls.forEach(cell => {if (cell.value !== "ship") cell.render()});
    }

}

class Ship {
    constructor(name){
        this.name = name;
        // this.board = board;
        // console.log(this.board)
        this.length = SHIPS[name].length;
        this.color = SHIPS[name].color;
        this.img = SHIPS[name].img;
        this.orientation = 'vertical';
        this.mousePosition = null;
        this.startPos = null;
        this.positionArray = [];
    }

    render(){
        const shipEl = document.createElement('div');
        shipEl.style.height = `${this.length * 3}vmin`;
        shipEl.style.width = '3vmin';
        shipEl.style.backgroundColor = `rgb(${this.color})`;
        shipEl.dataset.name = this.name;
        shipEl.dataset.length = this.length;

        if (this.positionArray.length === 0){
            shipEl.draggable = true;
            // shipEl.addEventListener('keydown', this.handleKeyDown.bind(this));
            shipEl.addEventListener('mousedown', this.handleMouseDown.bind(this));
            shipEl.addEventListener('dragstart', this.handleDragStart.bind(this));
            shipEl.addEventListener('dragend', this.handleDragEnd.bind(this));
            boardOneMenuEl.appendChild(shipEl)
        } else {
            shipEl.draggable = false;
            boardOneMenuEl.removeChild(document.querySelector(`[data-name="${this.name}"]`));
            console.log(games[gameNum].playerOne.board.cellEls)
            games[gameNum].playerOne.board.cellEls.forEach(cell => {
                if (this.positionArray.includes(cell.domElement.dataset.xy)){
                    cell.value = 'ship';
                    console.log(cell.domElement)
                    cell.domElement.classList.remove('hover');
                    cell.setShip(this.name);
                }
            });
            games[gameNum].playerOne.board.shipsPlaced++;


            // shipEl.style.position = 'absolute';
            // shipEl.style.left = `${this.startPos[0]*4.3}vmin`;
            // shipEl.style.top = `${this.startPos[1]}vmin`;
            // shipEl.style.zIndex = '1';
            // boardOneMenuEl.removeChild(document.querySelector(`[data-name="${this.name}"]`));
            // boardOneEl.appendChild(shipEl);
        }
    }

    mousePositionOnShip(evt){
        console.log('mouse position on ship')
        let bound = evt.target.getBoundingClientRect();
        let mouseY = evt.clientY - bound.top
        let mouseX = evt.clientX - bound.left
        let height = bound.height;
        let shipLength = SHIPS[games[gameNum].playerOne.board.currentShip].length;
        // height = window.getComputedStyle(evt.target).getPropertyValue('height');
        let positionY = Math.ceil(mouseY/height * shipLength);
        let positionX = Math.ceil(mouseX/height * shipLength);

        if (this.orientation === 'vertical'){
            return positionY;
        } else {
            return positionX;
        }
    }

    // handleKeyDown(evt){
    //     console.log('key down')
    //     console.log(evt.target.keyCode)
    // }

    handleMouseDown(evt){
        console.log('mouse down')
        games[gameNum].playerOne.board.currentShip = evt.target.dataset.name;
        games[gameNum].playerOne.board.currentShipMousePosition = this.mousePositionOnShip(evt);
        // console.log(this.mousePositionOnShip(evt))
    }

    handleDragStart(evt){
        const shipEl = evt.target;
        shipEl.style.opacity = '0.4';
        shipEl.style.boxShadow = '0 0 0.5vmin black';
    }

    handleDragEnd(evt){
        const shipEl = evt.target;
        console.log('drag end')
        console.log(shipEl.dataset.name)
        // evt.dataTransfer.setData('text/plain', shipEl.dataset.name);
        shipEl.style.opacity = '1';
        shipEl.style.boxShadow = '';
    }
}

class HumanShip extends Ship {
    constructor(name){
        super(name);
    }

    render(){
        const shipEl = document.createElement('div');
        shipEl.style.height = `${this.length * 3}vmin`;
        shipEl.style.width = '3vmin';
        shipEl.style.backgroundColor = `rgb(${this.color})`;
        shipEl.draggable = true;
        shipEl.dataset.name = this.name;
        shipEl.dataset.length = this.length;
        shipEl.addEventListener('keydown', this.handleKeyDown.bind(this));
        shipEl.addEventListener('mousedown', HumanPlayer.handleMouseDownShip.bind(this));
        shipEl.addEventListener('dragstart', this.handleDragStart.bind(this));
        shipEl.addEventListener('dragend', this.handleDragEnd.bind(this));
        boardOneMenuEl.appendChild(shipEl)
    }

}


class Player {
    constructor(name, board){
        this.name = name;
        this.board = board;
        this.hits = [];
        this.misses = [];
    }

    attack(){

    }

    placeShips(ship){

    }
}

class HumanPlayer extends Player {
    constructor(name, board){
        super(name, board);
        this.currentShip = null;
    }

    handleMouseDownShip(evt){
        console.log('mouse down on ship')
        
    
    }

    attack(){

    }

    placeShips(){
        
    }
}

class ComputerPlayer extends Player {
    constructor(name, board){
        super(name, board);
        //
    }

    attack(){

    }

    placeShips(){

    }
}

class Weapon {

}

class BattleShipGame {
    constructor(boardSize){
        this.boardSize = boardSize;
        this.music = true;
        this.soundEffects = true;
        this.inPlay = false;
        // this.scores = {};
    }

    play() {
        this.turn = 1;
        this.winner = null;
        this.ships = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'];
        const playerOneShips = this.ships.map(ship => new Ship(ship));
        const playerTwoShips = this.ships.map(ship => new Ship(ship));
        const playerOneBoard = new HumanBoard(this.boardSize, boardOneEl, playerOneShips);
        const playerTwoBoard = new ComputerBoard(this.boardSize, boardTwoEl, playerTwoShips);
        this.playerOne = new HumanPlayer('You', playerOneBoard);
        this.playerTwo = new ComputerPlayer('Computer', playerTwoBoard);
    }

    renderInit(){
        this.playerOne.board.init();
        this.playerTwo.board.init();
        this.playerOne.placeShips();
    }

    render(){
        this.renderBoard();
        this.renderScoreBoard();
        this.renderMessage();
    }

    renderBoard(){
        this.playerOne.board.render();
        this.playerTwo.board.render();
    }

    renderMessage(){
        if (games[gameNum].inPlay) msgEl.innerHTML = "Launch your attack!";
    }

    renderScoreBoard(){

    }

    renderControls(){

    }

}
  
/*----- functions -----*/
// init()

function init(){
    game = new BattleShipGame(10);
    games.push(game);
    games[gameNum].play();
    games[gameNum].renderInit();
    clearInterval(timerInterval);
    minutes = 5;
    seconds = 0;
    clearInterval(playInterval);
    msgEl.innerHTML = "Place your ships";

    inPlay();
}

function inPlay(){
    updateTimer();
    playInterval = setInterval(() => {
        if (games[gameNum].winner) return;
        games[gameNum].render();
        if (games[gameNum].playerOne.board.shipsPlaced === 5 && !games[gameNum].inPlay){
            timerInterval = setInterval(updateTimer, 1000);
            games[gameNum].inPlay = true;
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
