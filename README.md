# Battleship: The classic naval combat game
Battleship is a game of skill and luck where you try to sink your opponent’s fleet of warships before they sink yours. You can play with different types of ships, such as destroyers, cruisers or battleships, and place them on your grid. Then take turns firing missiles at your enemy’s grid, trying to guess where their ships are hidden. The game is over when one player loses all their ships.

## This Repository
This Battleship repository is my execution of building a simple browser game written in HTML, CSS & JavaScript. I built this game as my first of four projects for the Software Engineering Immersive course from [General Assembly](https://generalassemb.ly/). This game was created in five days as a solo project, fulfilling the basic requirements.

The game is written in an object oriented way with classes for each element of the game. The main classes are:
- Battleship: This class represents one instance of the game and handles the logic and events of the game.
- Player: This class represents each player and stores their name, board, ships, and shots taken.
- Board: This class represents each player’s board and stores the cells and the ships on the board.
- Cell: This class represents each cell on the board and stores its ship (if any) to render results of each attack.
- Ship: This class represents each ship on the board and stores its type, size and orientation.

I have a separate constants file that defines global constants for the game, for the time being just the available ships. I also have a separate cached elements file that stores some references to the document elements that are used frequently in the game, such as board menus and the message element.

# Live Peview
<p align="center">
Check out this game on Github Pages
<br>
  <a href="https://dinssa.github.io/battleship/"><strong>dinssa.github.io/battleship</strong></a>
</p>

# Getting Started
1. Clone the repo: `git clone https://github.com/Dinssa/battleship.git`
2. Open `index.html` in your favourite browser

# Brief
General Project Requirements:
- Render a game in the browser.
- Include win/loss logic and render win/loss messages in HTML. Popup alerts using the alert() method are okay during development, but not production.
- Include separate HTML, CSS & JavaScript files.
- Use vanilla JavaScript, not jQuery.
- Have properly indented HTML, CSS & JavaScript. In addition, vertical whitespace needs to be consistent.
- No remaining unused and/or commented out code (code that will never be called) .
- Have functions and variables that are named sensibly. Remember, functions are typically named as verbs and variables (data) named as nouns.
- Be coded in a consistent manner. For example, choose between your preference for function declarations vs. function expressions.
- Be deployed online using GitHub Pages so that the rest of the world can play your game!

Battleship Game Specific Requirements:
- Must have:
    - The game should be one player, with the computer placing its pieces randomly at the start of the game
    - The computer should be able to make random attacks on the player's board
- Suggested Enhancements:
    - Responsive Design
    - More intelligent attacks by the computer

# Planning
Pre-project I sketched out some wireframes of what the game could look like with each button and feature I aimed to include.

[![Game screen](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216542&authkey=%21AJG53o8YazSS1oc&width=900)](#)  

The game consists of two boards: one for the human player and one for the computer opponent. At the top of the screen, there is a scoreboard and a timer. On the left side, there is a game menu with four options: settings, rules, leaderboard, and music. The human player can drag and drop ships to their board and choose from different weapons to attack the computer. The game has four weapons available, including the basic bomb (mvp) and three others. The game menu allows the user to customise the game appearance or mode, learn the game rules and instructions, view previous scores, and toggle the music on or off.

In order to make programming the wireframe out easier I also had an annotated version of the wireframe with rectangles to plan out where each div container would be and how to group elements:

[![Game screen with annotations](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216543&authkey=%21AGyI0ttaP3nwbJs&width=900)](#)  

# Build Process
## First Steps
The first steps I took were to build what I know and implement the wireframe in HTML and CSS. Looking back, this was not the best strategy, even though I enjoyed it. I am happy with how it has turned out, visually it seems appealing and all the functionality I have included or will eventually include is illustrated. I took a mobile-first approach and designed it such that a user could play on smaller screens. The key feature that enables this is using CSS Grids to show a single column and assigning the ‘mobile-hide’ class to the board out of focus.

## Building with an Object-Oriented Approach
I made a decision early on to rely on classes for each element of the game and to follow object-oriented programming. However, I realised that I was using some classes in an unclear way, so I refactored the code to separate each class into its own js file and modularize the code from the main.js file (commit: 2ea5bad). 

I started with what I’d call a limiting ‘object-only’ approach, attempting to keep the universal functions such as declaring a winner within the Battleship class. I soon realised that this was not sustainable and adopted, true to its name, an ‘object-oriented’ approach with functions in man.hs for creating a new game and handling the game timer. This would become useful when I implement multiple concurrent games and for the moment to keep each classes’ logic strictly to handle what is appropriate for its namesake e.g. the battleship class would now not act as a class for the entire program but just for a single instance of a single game being played.

## Final Project Structure

The final project structure I landed with is as follows: 

[![Project structure](https://onedrive.live.com/embed?resid=3AAE4294F4C93984%216544&authkey=%21ANmA-qc34TXyOr8&width=950)](#)  

## Code snippets
A brief description of the parent program (main.js) is as follows: a battleship game which uses several classes to create and manage a single game logic, each player, the boards of each player and the ships of each board. It also uses some constants and cached elements to store and access data. I include event listeners to handle user input; some functions to initialise the games, render our screen and play the game. A timer is used to limit the game duration and within the play interval statements to alternate turns between the human and computer players. With each run within the play interval it also checks for a winner.

The following function inPlay() is an example of a function being used by the parent program (main.js) and not within a class.


```javascript
function inPlay(){
    updateTimer(); // Update timer once before setInterval, showing full game time
    let playOne = true; // Boolean to check if player one has played yet, used to alternate turns only after players have played 
    playInterval = setInterval(() => {
        if (games[gameNum].winner) return; // If there is a winner, stop playing
        
        render();

        // * If player one has placed all ships and game is not in play, start game
        if (games[gameNum].playerOne.board.shipsPlaced === 5 && !games[gameNum].inPlay){
            timerInterval = setInterval(updateTimer, 1000);
            games[gameNum].play();
        }

        // * If game is in play, play who's turn it is
        if (games[gameNum].inPlay){
            if (games[gameNum].turn === 1 && playOne) {
                games[gameNum].changeMessage("It's your turn!");
                games[gameNum].playerTwo.board.enableCells();
                playOne = false;
            } else if (games[gameNum].turn === -1 && !playOne) {
                games[gameNum].changeMessage(`It's ${playerTwo.getName()}'s turn!`);
                games[gameNum].playerTwo.board.disableCells();
                games[gameNum].playerTwo.attack();
                playOne = true;
            }
        }
        games[gameNum].winner = getWinner();
        if (games[gameNum].winner !== false) games[gameNum].changeMessage(`Time's up! ${games[gameNum].winner.getName()} wins.`); // If there is a winner when time is up
        if (games[gameNum].winner !== false && (minutes > 0 || seconds > 0)) games[gameNum].changeMessage(`${games[gameNum].winner.getName()} wins!`); // If there is a winner before time is up, show winner
    }, 200);
}
```

This function is called when a new game is created. A new game is currently started when you press play. Each game has a timer that counts down, initialised in the first line of inPlay(). There is also a boolean variable that indicates if it is player 1’s turn or not. This variable is toggled only after each player has made an attack. It stays the same while waiting for an attack.  Our timer is started only when and as soon as the human player has placed all their ships, our computer’s ships have by this point already been generated. Handling changing a player’s turn has seen multiple refactors throughout my commits and I settled on this version which asks the game class for whose turn it is (modified by each player’s attack method, although it may seem like duplicate functionality having the playOne boolean it helps prevent the game from running too fast (note: playOne should theoretically not be needed & requires revisiting). On the final lines we check to see if the move just played has any bearing on who is the winner and continue if not.

The board class contains the highlightCells() and unHighlightCells() functions, which were a challenging but useful piece of functionality that I decided to include. These functions enable the user to see the cells where they can place their draggable ships. I chose this feature because it also helped me with the placeShips() function.

```javascript
class Board {

...

    highlightCells(cell){
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

...

}
```

The functions are triggered by event listeners on the board element that handle drag movements (dragenter, dragover, dragleave and drop). To pass information to the board, I used methods in the Ship class that find the mouse position on a ship. I could not use the dataTransfer methods setData and getData because they only worked at the start and end of the drag event. The methods in the Ship class calculate how many cells above and below the current position need to be highlighted, based on the ship’s length and the mouse click location. For example, for a carrier of length 5, if I click on the middle tile (3 of 5), the current tile and 2 tiles up and down must be highlighted.  There are guards to check if the cells are within the board bounds and do not highlight or allow placement of ships outside of them. The sister unHighlightCells function removes the styling from the previous cells when the user drags the ship to a new position.

For when we eventually need to decide who our winner is there are a number of functions within main.js to handle each win condition but it all starts with getWinner().

```javascript
function getWinner(){
    return winByTimeOut() || winBySunkShip();
};

function winBySunkShip(){
    let totalShipLengths = Object.values(CONSTANTS.SHIPS).reduce(function (acc, ship) { return acc + ship.length; }, 0); // Total length of all ships
    // * If all ships of a player have been hit by their oppononent, return opponent as winner
    if (games[gameNum].playerTwo.getHits().length === totalShipLengths) {
        clearInterval(timerInterval);
        return games[gameNum].playerOne;
    }
    if (games[gameNum].playerOne.getHits().length === totalShipLengths) {
        clearInterval(timerInterval);
        return games[gameNum].playerTwo;
    } 
    return false;
}

function winByTimeOut(){
    if (minutes === 0 && seconds === 0){
        games[gameNum].playerTwo.board.disableCells();
        games[gameNum].changeMessage("Time's up!");
        
        // * Where time has run out and neither player has won yet
        if (games[gameNum].playerTwo.getHits().length > games[gameNum].playerOne.getHits().length) {
            // If player two has more hits than player one, return player one as winner
            return games[gameNum].playerOne;
        } else if (games[gameNum].playerTwo.getHits().length < games[gameNum].playerOne.getHits().length){
            // If player one has more hits than player two, return player two as winner
            return games[gameNum].playerTwo;
        } else {
            // If both players have the same number of hits, return no one as winner
            return {getName: () => 'No one'}
        }
    }
    return false;
}
```
As we saw in the inPlay() function the final lines are to set the game winner from its default value falsy value to the value returned by the above getWinner() function. There are two win scenarios: 1) when time runs out, the player with the most hits wins, or a tie if equal; or 2) before time runs out, the first player to hit all parts of their opponent’s ships. We know how many potential hits exist by tallying the length of all ships within the constants and compare against this value.

# Challenges
- Draggable ships were challenging, it was challenging to find the right way to implement the concept and pass information to the board.  I’m still not 100% happy with my implementation of this as it requires altering a class global variable rather than passing information for the specific ship at the moment. I have not yet implemented allowing a user to rotate a ship while dragging and getting an immediate response on the screen but that can be left to future improvements. However, I was able to implement a core functionality to place ships in horizontal or vertical orientations. I decided to focus on other features such as placing ships for the computer and handling attacks, which were not yet complete and move on.
- Finding the right position on the ship that the user clicked with the mouse, such as the top, middle or bottom was also challenging. To do this, I had to log several mouse and document events to get the ship’s coordinate, calculate its true length, and determine the mouse’s position relative to the ship. It involved solving some maths problems on paper to create and test a formula to calculate the position as a single integer number. I did so with different cases (ships and positions clicked), including edge cases. However, the length of the ship calculated that this formula uses is always shorter than it is supposed to be. This does not affect the game much, but it may cause some minor errors in the preview of highlighted cells where the cells highlighted are offset one cell from where you expect. Either way, the player’s ships are still placed on the highlighted cells so there is no impact on game play.

# Wins
- Pretty happy with the conciseness of the code, but I know there are still some areas that need refactoring to make it smoother. I have aimed to make the code self-explanatory by using clear and descriptive names for variables and methods. I hope this makes it easy for others to understand the logic and functionality of the game.
- The visual design in addition to my mobile-first responsive design is something I am also happy with. A couple of ideas I’ve had in this area have not yet been implemented but will be. As time for this project was running low I pivoted to working on the game logic with only occasional commits to improve the frontend when I needed to take a break.

# Key Learnings & Takeaways
- One of the key lessons I learned from this project is the importance of planning ahead with pseudocode. The pseudocode I did write was not as fleshed out as it could have been and this caused me to have to refactor early on. Going forward I will invest more time into writing pseudocode to make the task easier and more efficent.

# Bugs
- When I did include a play again button I encountered a bug after finishing one round. The game seemed to reload properly, but when I dragged and dropped the ships on the grid, some of them did not highlight the correct number of cells. For example, the battleship only showed 3 cells instead of 5. I think this might be caused by some variables not being reset properly after each round. If I had more time, I would debug the code step by step and find out where the problem was. I would also consider refactoring and redesigning the drag and drop functionality, as it also currently does not indicate the orientation of the ships.

# Future Improvements
With some of the future improvements I’ll list here the backend is already primed for their implementation. What I didn’t have was time to implement them, as there was usually something more important to implement first. In general, I’ve created variables for data that can be customised and created functions that can be reused.

## Game Customisation
With minor changes users will be able to set their own username within the startup screen. The UI element is there and just requires grabbing the data from the DOM and setting the appropriate variable. A similar feature has already been included to set a user’s avatar image.

‘Difficulty’ (of the computer) and ‘War’ (size of the board and number of ships) will involve more time and thought. The first of these to include would be working on difficulty and adding a more intelligent computer player. For the difficulty levels, I would implement the following features:
- Easy: Computer attacks randomly but continues to hunt down a ship once it hits a part of it.
- Medium: Computer attacks in a checkerboard pattern until it hits a ship, then switches to hunting mode. Increasing its chances of finding a ship by 50%, since all ships have a minimum length of two.
- Hard: Computer uses a probability-based algorithm that takes into account the lengths of the remaining ships and the ships on the board not yet hit. It’d then make an educated guess and tires to find the largest ship first.
- Handicap: I may also include a function that forces the computer to make an error and choose the wrong place to hit, with a higher probability of doing so on easy and the lowest on hard.

The game would be a little more entertaining with music and sound effects, I’ve already included the UI elements to toggle them on and off and this would take a short time to implement.

## Different Weapons
It’d be great to implement the weapons class. My initial idea behind this was to have 4 types of weapons, the first of which is the single tile bomb already implemented, the 3 others are:
- Missile: 5 positions hit, place chosen, one up, one down, one left and one right.
- Blitz: 5 random locations around the board, regardless if they’re hit already or not.
- Nuke: 13 positions, two up, two down, two left, two right, one in each diagonal.

The weapons class could introduce some new strategies and tactics for both the player and the computer. To keep the game fair and balanced this would need to be limited, such as limiting usage and not having the additional weapons available immediately. Each player could also only receive a weapon in the event of a significant score difference or an extended period of misses.

## More than just Player vs Computer
What if a player wanted to play again against the computer or even another player? That was also in my mind when designing this game, creating the classes and appropriate variables.The first step would be to polish the single game instance but the next would be to have multiple game instances and a running scoreboard with results in the leaderboard. I’d then have to start thinking about how to allow two players to play together, but this would likely require a database like MongoDB to store user accounts, and ongoing game instances. In the browser for each player the user interface would look pretty much the same.


