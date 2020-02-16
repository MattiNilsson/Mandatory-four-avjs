import React, { useState } from 'react';

// Skapar Spelbrädet
function makeGrid(){
  let newGrid = []
  for(let i = 0; i < 7; i++){
    newGrid[i] = [];
    for(let j = 0; j < 6; j++){
      newGrid[i][j] = "false";
    }
  }
  return newGrid;
}

// Funktionen som sätter marköerna på brädspelet
function placeMarker(e, grid, changeGrid, rules, changeRules){
  let newID = e.target.id
  let newGrid = [...grid];
  if(newGrid[newID][0] !== "false"){
    alert("Already Filled");
    return;
  }
  for(let i = 0; i < 7; i++){
    if(newGrid[newID][i] !== "false"){
      newGrid[newID][i - 1] = rules.player;
      break;
    }
    if(i === newGrid[newID].length - 1){
      newGrid[newID][i] = rules.player;
      break;
    }
  }
  console.log(rules.markers)
  changeGrid(newGrid);
  
  checkAll(newGrid, rules, changeRules)
}

// När spelaren placerat sin bricka checkar denna funktionen,
// igenom alla möjliga markörer för att sedan köra funktionen check.
function checkAll(grid, rules, changeRules){
  let finished = false;
  for(let k = 0; k < 6 && !finished; k++){
    for(let l = 0; l < 7 && !finished; l++){
      finished = check(l,k, grid, rules, changeRules, finished);
    }
  }
}


// Ser till så att vi inte råkar ta tag i en placering som inte finns.
function getSquare(x, y, grid) {
  if (grid[x] && grid[x][y]) {
      return grid[x][y]
  }
  return null;
}

// Här händer Magin. först finns det en array med object visar vilket håll den ska kolla.

// Sedan Kollar den vilken spelare som lade ut sin bricka. eftersom spelaren som lade ut sin bricka,
// bara är den som skulle kunna vinna i detta fallet så letar den bara denna spelarens brickor.
function check(posX, posY, grid, rules, changeRules, finished){
//  X - 1 === UNDEFINED
  let winArr = [
    {x:1, y:1},
    {x:-1, y:1},
    {x:1, y:-1},
    {x:-1, y:-1},
    {x:0, y:1},
    {x:0, y:-1},
    {x:1, y:0},
    {x:-1, y:0}
  ]

  let amount = 0;

  let whichMarks = [];

  if(!rules.gameOver && rules.player === "playerTwo"){
    for(let i = 0; i < winArr.length &&  !finished; i++){
      for(let j = 0; j < 4 && !finished; j++){
        if(getSquare((winArr[i].x * j) + posX, (winArr[i].y * j) + posY, grid) === "playerTwo"){
          amount++
          whichMarks[j] = {x : (winArr[i].x * j) + posX, y : (winArr[i].y * j) + posY}
          if(amount === 4 && !rules.gameOver){
            console.log(whichMarks)
            changeRules({...rules, gameOver : true, winner : "Two", winnerMarks : whichMarks})
            return true;
          }
        }else{
          if(amount < 4){
            amount = 0;
            changeRules({...rules, player : "playerOne", markers : rules.markers + 1})
            break;
          }
        }
      }
    }
  }else{
    for(let i = 0; i < winArr.length && !finished; i++){
      for(let j = 0; j < 4 && !finished; j++){
        if(getSquare((winArr[i].x * j) + posX, (winArr[i].y * j) + posY, grid) === "playerOne"){
          amount++
          whichMarks[j] = {x : (winArr[i].x * j) + posX, y : (winArr[i].y * j) + posY}
          if(amount === 4 && !rules.gameOver){
            console.log(whichMarks)
            changeRules({...rules, gameOver : true, winner : "One", winnerMarks : whichMarks})
            return true;
          }
        }else{
          if(amount < 4){
            amount = 0;
            changeRules({...rules, player : "playerTwo", markers : rules.markers + 1})
            break;
          }
        }
      }
    }
  }
  if(rules.markers === 41){
    changeRules({...rules, gameOver : true, winner : "Tie"})
  }
}

// Snabb reset funktion som helt enkelt återställer alla states samt grid till sitt ursprung.
function resetGame(e, grid, changeGrid, rules, changeRules){
  changeRules({player : "playerOne", gameOver : false, winner : "", winnerMarks : null, markers : 0})
  changeGrid(makeGrid());
}

// Render funktionen. Kritisera gärna ifall du tycker jag skulle ha brutit ut vissa delar till
// separata funktioner.
function Grid() {
  const [grid, changeGrid] = useState(makeGrid());
  const [rules, changeRules] = useState({
    player : "playerOne", 
    gameOver : false, 
    winner : "", 
    winnerMarks : null,
    markers : 0,
  });

  if(rules.winnerMarks){
    let newGrid = [...grid];
    if(rules.winner === "One"){
      for(let i = 0; i < 4; i++){
        newGrid[rules.winnerMarks[i].x][rules.winnerMarks[i].y] = "winnerOne";
      }
    }else{
      for(let i = 0; i < 4; i++){
        newGrid[rules.winnerMarks[i].x][rules.winnerMarks[i].y] = "winnerTwo";
      }
    }
    changeRules({...rules, winnerMarks : null});
    changeGrid(newGrid);
  }

  let resetBtn;
  if(rules.gameOver){
    resetBtn = (<button onClick={(e) => resetGame(e, grid, changeGrid, rules, changeRules)}><h1>Reset Game</h1></button>);
  }else{
    resetBtn = null;
  }

  let playerTurn;
  if(rules.player === "playerOne" && rules.gameOver === false){
    playerTurn = (<h1 className="playerOneTurn">Player One's Turn!</h1>)
  }else if(rules.player === "playerTwo" && rules.gameOver === false){
    playerTurn = (<h1 className="playerTwoTurn">Player Two's Turn!</h1>)
  }else if(rules.winner === "One"){
    playerTurn = (<h1 className="playerOneTurn">PLaYER ONE WINS!!!</h1>)
  }else if(rules.winner === "Two"){
    playerTurn = (<h1 className="playerTwoTurn">PLaYER TWO WINS!!!</h1>)
  }else if(rules.winner === "Tie"){
    playerTurn = (<h1 className="playerTwoTurn">It is a tie...</h1>)
  }
  
  return (
    <div className="flex">
      {playerTurn}
      <div className={"grid " + rules.winner} id="wrongParent">
        {grid.map((column, colId) => {
          return (
          <div 
            key={colId} 
            onClick={(e) => {if(!rules.gameOver){placeMarker(e, grid, changeGrid, rules, changeRules)}}} 
            className="column" 
            id={colId}
            >{column.map((tile, id) => {
              return (
                <div 
                  key={id} 
                  className={"tile " + grid[colId][id]}
                ></div>
              )
          })}</div>
          )
        })}
      </div>
      {resetBtn}
    </div>
  );
}

export default Grid;
