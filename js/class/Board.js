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
        this.currentShipOrientation = null;
    }

    setShips(ships){
        this.ships = ships;
    }

    getShips(){
        return this.ships
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
        // console.log(this)
        this.boardElement.addEventListener('dragenter', this.handleDragEnter.bind(this));
        this.boardElement.addEventListener('dragover', this.handleDragOver.bind(this));
        this.boardElement.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.boardElement.addEventListener('drop', this.handleDragDrop.bind(this));
        this.cellsBelow = [];
    }
    
    highlightCells(cell){
        // TODO: Fix bug where highlighting cells doesn't work properly on the next game
        let ship = SHIPS[this.currentShip];
        let shipMousePosition = this.currentShipMousePosition;
        let cellPosition = cell.dataset.xy.split('-');
        let cellX = parseInt(cellPosition[0]);
        let cellY = parseInt(cellPosition[1]);
        this.cellsBelow = [];
        this.cellsBelow.push(cell.dataset.xy);
        let validPosition = true;
        
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
            // TODO: Horizontal
        }

        this.cellsBelow.forEach(xy => {
            let cell = this.cellEls.find(cell => cell.domElement.dataset.xy === xy)
            if (cell.value !== 'empty') validPosition = false;
        })

        if (validPosition) this.cellsBelow.forEach(xy => document.querySelector(`[data-xy="${xy}"]`).classList.add('hover'))


    }

    unHighlightCells(cell){
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
    }

    handleDragLeave(evt){
        evt.preventDefault();
        const cell = evt.target;
        this.unHighlightCells(cell);
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
    }

    render(){
        this.cellEls.forEach(cell => {if (cell.value !== "ship") cell.render()});
    }

}