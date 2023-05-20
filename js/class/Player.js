import { games, gameNum } from '../main.js';

class Player {
    constructor(name){
        this.name = name;
        this.hits = [];
        this.misses = [];
        this.score = 0;
        this.board;
        this.opponentBoard;
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

    addHit(xy){
        this.hits.push(xy);
    }

    getHits(){
        return this.hits;
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

    initShips(){
        games[gameNum].changeMessage("Place your ships");
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
            games[gameNum].toggleTurn();
        }, 1000); 
    }

    getRandomCellXY(){
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        return `${x}-${y}`;
    }
}