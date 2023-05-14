import { SHIPS } from '../constants.js';
import { boardOneMenuEl, boardTwoMenuEl, boardOneEl, boardTwoEl, msgEl, playBtn, timerEl } from '../cached.js';
import { games, gameNum } from '../main.js';

class Ship {
    constructor(name, board){
        this.name = name;
        this.board = board;
        // console.log(this.board)
        this.length = SHIPS[name].length;
        this.color = SHIPS[name].color;
        this.img = SHIPS[name].img;
        this.orientation = 'vertical';
        this.mousePosition = null;
        this.startPos = null;
        this.positionArray = [];
    }
}

export class HumanShip extends Ship {
    constructor(name, board){
        super(name, board);
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
            shipEl.addEventListener('keypress', this.toggleOrientation.bind(this));
            boardOneMenuEl.appendChild(shipEl)
        } else {
            shipEl.draggable = false;
            boardOneMenuEl.removeChild(document.querySelector(`[data-name="${this.name}"]`));
            this.board.cellEls.forEach(cell => {
                if (this.positionArray.includes(cell.domElement.dataset.xy)){
                    cell.value = 'ship';
                    cell.domElement.classList.remove('hover');
                    cell.setShip(this.name);
                }
            });
            this.board.render();
            this.board.shipsPlaced++;
            
            // - Alternative Approach: To render the ship on the board
            // shipEl.style.position = 'absolute';
            // shipEl.style.left = `${this.startPos[0]*4.3}vmin`;
            // shipEl.style.top = `${this.startPos[1]}vmin`;
            // shipEl.style.zIndex = '1';
            // boardOneMenuEl.removeChild(document.querySelector(`[data-name="${this.name}"]`));
            // boardOneEl.appendChild(shipEl);
        }
    }

    mousePositionOnShip(evt){
        // console.log('mouse position on ship')
        let bound = evt.target.getBoundingClientRect();
        let mouseY = evt.clientY - bound.top
        let mouseX = evt.clientX - bound.left
        let height = bound.height;
        console.log(evt.target.dataset.name);
        let shipLength = SHIPS[evt.target.dataset.name].length;
        // height = window.getComputedStyle(evt.target).getPropertyValue('height');
        let positionY = Math.ceil(mouseY/height * shipLength);
        let positionX = Math.ceil(mouseX/height * shipLength);

        if (this.orientation === 'vertical'){
            return positionY;
        } else {
            return positionX;
        }
    }

    toggleOrientation(evt){

        console.log(evt.key)

        console.log('toggle orientation')
        if (this.orientation === 'vertical'){
            this.orientation = 'horizontal';
        } else {
            this.orientation = 'vertical';
        }
    }

    // handleKeyDown(evt){
    //     console.log('key down')
    //     console.log(evt.target.keyCode)
    // }

    handleMouseDown(evt){
        console.log('mouse down')
        this.board.setShipSelection(evt.target.dataset.name, this.mousePositionOnShip(evt), this.orientation);
    }

    handleDragStart(evt){
        console.log('drag start')
        const shipEl = evt.target;
        shipEl.style.opacity = '0.4';
        shipEl.style.boxShadow = '0 0 0.5vmin black';
    }

    handleDragEnd(evt){
        const shipEl = evt.target;
        console.log('drag end')
        console.log(shipEl.dataset.name)
        shipEl.style.opacity = '1';
        shipEl.style.boxShadow = '';
    }
}

export class ComputerShip extends Ship {
    constructor(name){
        super(name);
    }
}