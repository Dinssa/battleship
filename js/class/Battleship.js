export class BattleShipGame {
    constructor(){
        this.music = false;
        this.soundEffects = false;
        this.inPlay = false;
        this.winner = null;
        this.turn = 1;
    }

    init(){
        this.music = true;
        this.soundEffects = true;
    }

    play() {
        this.inPlay = true;
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