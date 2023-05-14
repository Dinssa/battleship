import { boardOneEl, boardOneMenuEl, boardTwoMenuEl, boardTwoEl, msgEl, playBtn, timerEl } from '../cached.js'; 

class Player {
    constructor(name){
        this.name = name;
        this.hits = [];
        this.misses = [];
        this.score = 0;
    }

    attack(){

    }

    placeShips(ship){

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

    attack(){

    }

    placeShips(){
        
    }
}

export class ComputerPlayer extends Player {
    constructor(name){
        super(name);
        //
    }

    attack(){

    }

    placeShips(){

    }
}