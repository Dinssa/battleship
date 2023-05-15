import { boardOneEl, boardOneMenuEl, boardTwoMenuEl, boardTwoEl, msgEl, playBtn, timerEl } from '../cached.js'; 

class Player {
    constructor(name){
        this.name = name;
        this.hits = [];
        this.misses = [];
        this.score = 0;
        this.board;
        this.opponentBoard;
        this.game;
        this.ships;
    }

    getName(){
        return this.name;
    }

    setBoard(board){
        this.board = board;
    }

    setOpponentBoard(board){
        this.opponentBoard = board;
    }

    setShips(ships){
        this.ships = ships;
    }

    setGame(game){
        this.game = game;
    }

    addHit(xy){
        this.hits.push(xy);
    }

    addMiss(xy){
        this.misses.push(xy);
    }

    getNumAttacks(){
        return this.hits.length + this.misses.length;
    }
}

export class HumanPlayer extends Player {
    constructor(name){
        super(name);
        this.currentShip = null;
    }

    handleMouseDownShip(evt){
        console.log('mouse down on ship')
    }

    initShips(ships){
        msgEl.innerHTML = "Place your ships";
        this.ships = ships;
        this.ships.forEach(ship => ship.render());
    }

}

export class ComputerPlayer extends Player {
    constructor(name){
        super(name);
        this.target = null; // Current Focus of Attack
    }

    attack(){
        setTimeout(() => {
            const xy = this.getRandomCellXY();
            const cell = this.opponentBoard.getCell(xy);
            console.log(cell);
            if (cell.getValue() === 'ship'){
                this.target = xy;
                cell.setValue('hit');
                this.addHit(xy);
                this.score++;
                if (this.score === 17) this.game.winner = this;
            } else if (cell.getValue() === 'empty') {
                cell.setValue('miss');
                this.addMiss(xy);
            }
            this.game.toggleTurn();
            console.log('turn: ', this.game.turn)
        }, 2000); 
    }

    getRandomCellXY(){
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return `${x}-${y}`;
    }
}