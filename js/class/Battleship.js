import { boardOneEl, boardOneMenuEl, boardTwoMenuEl, boardTwoEl, msgEl, playBtn, timerEl } from '../cached.js'; 

export class BattleShipGame {
    constructor(){
        this.music = false;
        this.soundEffects = false;
        this.inPlay = false;
        this.winner = null;
        this.turn = 1;
        this.playerOne = null;
        this.playerTwo = null;
    }

    init(){
        this.music = true;
        this.soundEffects = true;
    }

    play() {
        this.inPlay = true;
    }

    toggleTurn(){
        this.turn *= -1;
    }

    setPlayerOne(player){
        this.playerOne = player;
    }

    setPlayerTwo(player){
        this.playerTwo = player;
    }

    changeMessage(message){
        msgEl.innerText = message;
    }

    renderInit(){
        // this.playerOne.board.init();
        // this.playerTwo.board.init();
        // this.playerOne.placeShips();
    }

    render(){
        // this.renderBoard();
        // this.renderScoreBoard();
        // this.renderMessage();
    }

    renderBoard(){
        // this.playerOne.board.render();
        // this.playerTwo.board.render();
    }

    renderMessage(){
        // if (games[gameNum].inPlay) msgEl.innerHTML = "Launch your attack!";
    }

    renderScoreBoard(){

    }

    renderControls(){

    }

}