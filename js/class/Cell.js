import { SHIPS } from '../constants.js';

export class Cell {
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