import { SHIPS } from '../constants.js';

export class Cell {
    constructor(domElement) {
        this.domElement = domElement;
        this.value = 'empty';
        this.shipName = '';
        this.shipVisible = false;
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

    setValue(value){
        this.value = value;
        this.render();
    }

    setShipVisible(){
        this.shipVisible = true;
    }

    getValue(){
        return this.value;
    }

    render(){
        this.domElement.style.backgroundColor = (this.shipVisible || this.value !== "ship") ? this.renderLookup[this.value] : this.renderLookup['empty'];
    }
}


// class GraphicalCell extends Cell {

// }