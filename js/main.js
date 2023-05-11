/*----- constants -----*/

/*----- state variables -----*/
let game;
  
/*----- cached elements  -----*/
const boardOneEl = document.getElementById('board-one-inner');
const boardTwoEl = document.getElementById('board-two-inner');
const msgEl = document.querySelector('#message>p');
const playBtn = document.querySelector('#controls>button');

/*----- event listeners -----*/
playBtn.addEventListener('click', init);

/*----- classes -----*/
class Cell {
    constructor(domElement) {
        this.domElement = domElement;
        this.value = 'empty';
    }

    static renderLookup = {
        'empty': 'white',
        'ship' : 'navy',
        'hit'  : 'orange',
        'miss' : 'lightgrey',
        'sunk' : 'red'
    }

    render(){
        this.domElement.style.backgroundColor = Cell.renderLookup[this.value];
    }
}

// class GraphicalCell extends Cell {

// }

class Board {
    constructor(boardSize, boardElement){
        this.size = boardSize;
        this.boardElement = boardElement;
        this.cells = [];
    }

    init(){
        this.boardElement.innerHTML = '';
        for(let i = 0; i < this.size; i++){
            const row = document.createElement('div');
            row.classList.add('row');
            for(let j = 0; j < this.size; j++){
                const cell = new Cell(document.createElement('div'));
                this.cells.push(cell);
                cell.domElement.classList.add('cell');
                cell.domElement.dataset.xy = `${i}-${j}`;
                row.append(cell.domElement);
            }
            this.boardElement.append(row);
        }
    }

    render(){
        this.cells.forEach(cell => cell.render());
    }
}

class HumanBoard extends Board {   


}

class ComputerBoard extends Board {

    render(){
        this.cells.forEach(cell => {if (cell.value !== "ship") cell.render()});
    }

}

class Ship {   

}

class Player {
    constructor(name, boardElement){
        this.name = name;
        this.ships = [];
        this.board = new Board(10, boardElement);
        this.hits = [];
        this.misses = [];
    }

    attack(){

    }

    placeShips(){

    }
}

class ComputerPlayer extends Player {
    constructor(name, boardElement){
        super(name, boardElement);
        this.board = new ComputerBoard(10, boardElement);
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
    }

    play() {
        this.turn = 1;
        this.winner = null;
        this.playerOne = new Player('You', boardOneEl);
        this.playerTwo = new ComputerPlayer('Computer', boardTwoEl);
        this.renderInit();
        this.render();
    }

    renderInit(){
        this.playerOne.board.init();
        this.playerTwo.board.init();   
    }

    render(){
        this.renderBoard();
        this.renderScoreBoard();
    }

    renderBoard(){
        this.playerOne.board.render();
        this.playerTwo.board.render();
    }

    renderScoreBoard(){

    }

}
  
/*----- functions -----*/
// init()

function init(){
    game = new BattleShipGame(10);
    game.play();
}