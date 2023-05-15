import { Cell } from './Cell.js';
import { boardOneEl, boardOneMenuEl, boardTwoMenuEl, boardTwoEl, msgEl, playBtn, timerEl } from '../cached.js';
import { SHIPS } from '../constants.js';


class Board {
    constructor(boardSize, boardElement){
        this.size = boardSize;
        this.boardElement = boardElement;
        this.cellEls = [];
        this.ships;
        this.shipsPlaced = 0;
        this.shipPositions = [];
        this.currentShip = null;
        this.currentShipMousePosition = null;
        this.currentShipOrientation = 'vertical';
    }

    setShips(ships){
        this.ships = ships;
    }

    getShips(){
        return this.ships
    }

    getCells(){
        return this.cellEls;
    }

    setShipSelection(ship, mousePosition, orientation){
        this.currentShip = ship;
        this.currentShipMousePosition = mousePosition;
        this.currentShipOrientation = orientation;
        console.log(this);
    }

    getShipSelection(){
        let shipName = this.currentShip;
        let mousePosition = this.currentShipMousePosition;
        let shipOrientation = this.currentShipOrientation;
        return {shipName, mousePosition, shipOrientation}
    }

    init(){
        this.initBoard();
        this.initMenus();
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

    initMenus(){
        boardOneMenuEl.innerHTML = '';
        boardOneMenuEl.classList.remove('hidden');
        boardTwoMenuEl.classList.remove('hidden');
    }

    render(){
        this.cellEls.forEach(cell => cell.render());
    }
}

export class HumanBoard extends Board {
    constructor(boardSize, boardElement){
        super(boardSize, boardElement);
        this.boardElement.addEventListener('dragenter', this.handleDragEnter.bind(this));
        this.boardElement.addEventListener('dragover', this.handleDragOver.bind(this));
        this.boardElement.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.boardElement.addEventListener('drop', this.handleDragDrop.bind(this));
        this.cellsBelow = [];
    }

    render(){
        this.cellEls.forEach(cell => {
            cell.setShipVisible();
            cell.render();
        });
    }

    toggleOrientation(){
        // TODO: Add visual orientation of ship while dragging
        this.getShipOrientation() === 'vertical' ? this.setShipOrientation('horizontal') : this.setShipOrientation('vertical');
        // console.log(this.currentShipOrientation)
        // boardOneMenuEl.innerHTML = '';
        let shipsNotPlaced = this.ships.filter(ship => ship.positionArray.length === 0);
        console.log(shipsNotPlaced);

        // while (boardOneMenuEl.lastChild) {
        //     boardOneMenuEl.removeChild(boardOneMenuEl.lastChild);
        // }

        shipsNotPlaced.forEach(ship => {
            ship.toggleOrientation();
            // ship.render();
            // console.log(ship.getShipOrientation());
        });
        console.log(this.currentShipOrientation)        
    }

    getShipOrientation(){
        return this.currentShipOrientation;
    }

    setShipOrientation(orientation){
        this.currentShipOrientation = orientation;
    }
    
    highlightCells(cell){
        // TODO: Fix bug where highlighting cells doesn't work properly on the next game
        // TODO: Fix bug where sometimes highlighted cells linger when ship not placed until placing next ship
        console.log(this.getShipOrientation())
        let ship = SHIPS[this.currentShip];
        let shipMousePosition = this.currentShipMousePosition;
        let cellPosition = cell.dataset.xy.split('-');
        let cellX = parseInt(cellPosition[0]);
        let cellY = parseInt(cellPosition[1]);
        this.cellsBelow = [];
        this.cellsBelow.push(cell.dataset.xy);
        let validPosition = true;
        // console.log(this.getShipOrientation())
        if (this.currentShipOrientation === 'vertical'){
            for (let i = ship.length - shipMousePosition; i > 0; i--){
                if (cellY + i > 9) return; // Guard: if ship is too long to fit on board
                if (this.shipPositions.includes(`${cellX}-${cellY + i}`)) return; // Guard: if ship is overlapping another ship
                this.cellsBelow.push(`${cellX}-${cellY + i}`)
            }
            for (let i = shipMousePosition - 1; i > 0; i--){
                if (cellY - i < 0) return; // Guard: if ship is too long to fit on board
                this.cellsBelow.push(`${cellX}-${cellY - i}`)
            }
        } else {
            for (let i = ship.length - shipMousePosition; i > 0; i--){
                if (cellX + i > 9) return; // Guard: if ship is too long to fit on board
                if (this.shipPositions.includes(`${cellX + i}-${cellY}`)) return; // Guard: if ship is overlapping another ship
                this.cellsBelow.push(`${cellX + i}-${cellY}`)
            }
            for (let i = shipMousePosition - 1; i > 0; i--){
                if (cellX - i < 0) return; // Guard: if ship is too long to fit on board
                this.cellsBelow.push(`${cellX - i}-${cellY}`)
            }
        }

        this.cellsBelow.forEach(xy => {
            let cell = this.cellEls.find(cell => cell.domElement.dataset.xy === xy)
            if (cell.value !== 'empty') validPosition = false;
        })

        if (validPosition) this.cellsBelow.forEach(xy => document.querySelector(`[data-xy="${xy}"]`).classList.add('hover'))

    }

    unHighlightCells(){
        let boardCellEls = document.querySelectorAll('#board-one-inner > .row > .cell');
        boardCellEls.forEach(cell => (!this.cellsBelow.includes(cell.dataset.xy)) ? cell.classList.remove('hover') : null);
        document.body.style.cursor = "default";
    }

    placeShip(cell){
        let ship = this.ships.find(ship => ship.name === this.currentShip);
        if (this.cellsBelow.some(cellXY => this.shipPositions.includes(cellXY))) return;

        ship.positionArray = this.cellsBelow;
        console.log(ship.positionArray)
        this.shipPositions.push(...ship.positionArray)
        console.log(this.shipPositions)
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
        this.highlightCells(cell);
    }

    handleDragOver(evt){
        evt.preventDefault();
        this.unHighlightCells();
    }

    handleDragLeave(evt){
        evt.preventDefault();
        const cell = evt.target;
        this.unHighlightCells();
    }

    handleDragDrop(evt){
        evt.preventDefault();
        const cell = evt.target;
        this.placeShip(cell);
    }

}

export class ComputerBoard extends Board {
    constructor(boardSize, boardElement){
        super(boardSize, boardElement);
        this.handleAttack = this.handleCellClick.bind(this);
        // boardTwoEl.addEventListener('click', this.handleAttack);
    }

    initCells(){
        let cells = boardTwoEl.querySelectorAll('.cell');
        // console.log(cells);
        cells.forEach(cell => {
            cell.addEventListener('click', this.handleAttack);
        });
    }

    handleCellClick(evt){
        console.log('computer board cell clicked');
        console.log(evt.target.dataset.xy);
        evt.target.style.cursor = "default";
        evt.target.removeEventListener('click', this.handleAttack);
        // console.log(this.cellEls)
        let cell = this.cellEls.find(cell => cell.domElement.dataset.xy === evt.target.dataset.xy);
        console.log(cell)
        if (cell.value === 'ship'){
            cell.setValue('hit');
            cell.setShipVisible();
            cell.render();
        } else {
            cell.setValue('miss');
            console.log(cell)
            cell.render();
        }
    }

    render(){
        this.cellEls.forEach(cell => cell.render());
    }

    placeShips(){
        let ships = Object.keys(SHIPS);
        let boardMiddle = Math.floor(this.size / 2) - 1;

        ships.forEach(shipName => {
            let acceptablePosition = false;
            let positionArray = [];

            while (acceptablePosition === false) {
                let startPos = this.getRandomPosition();
                let orientation = this.getRandomOrientation();
                let shipArray = [];

                if (orientation === 'vertical'){
                    let direction = (startPos[1] < boardMiddle) ? 1 : -1; // 1 = down, -1 = up
                    for (let i = 0; i < SHIPS[shipName].length; i++){
                        if (startPos[1] + (i * direction) > 9 || startPos[1] + (i * direction) < 0) continue;
                        shipArray.push(`${startPos[0]}-${startPos[1] + (i * direction)}`)
                    } 
                } else {
                    let direction = (startPos[0] < boardMiddle) ? 1 : -1; // 1 = right, -1 = left
                    for (let i = 0; i < SHIPS[shipName].length; i++){
                        if (startPos[0] + (i * direction) > 9 || startPos[0] + (i * direction) < 0) continue;
                        shipArray.push(`${startPos[0] + (i * direction)}-${startPos[1]}`)
                    }
                }

                if (shipArray.every(xy => !positionArray.includes(xy) && !this.shipPositions.includes(xy))) {
                    positionArray.push(...shipArray);
                    acceptablePosition = true;
                  }
            }
            this.shipPositions.push(...positionArray);
            this.cellEls.forEach(cell => {
                if (positionArray.includes(cell.domElement.dataset.xy)){
                    cell.setShip(shipName);
                    cell.setValue('ship');
                }
            });
        });
        console.log(this.shipPositions);
    }

    getRandomOrientation(){
        return Math.random() < 0.5 ? 'vertical' : 'horizontal';
    }

    getRandomPosition(){
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        return [x, y];
    }

}