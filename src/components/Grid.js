import React, { useState } from 'react';

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
  changeGrid(newGrid);
  if(rules.player === "playerOne"){
    checkAll(newGrid, rules, changeRules)
  }else{
    checkAll(newGrid, rules, changeRules)
  }
}


function checkAll(grid, rules, changeRules){
  let finished = false;
  for(let k = 0; k < 6 && !finished; k++){
    for(let l = 0; l < 7 && !finished; l++){
      finished = check(l,k, grid, rules, changeRules, finished);
    }
  }
}

function getSquare(x, y, grid) {
  if (grid[x] && grid[x][y]) {
      return grid[x][y]
  }
  return null;
}

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

  if(!rules.gameOver && rules.player === "playerTwo"){
    for(let i = 0; i < winArr.length &&  !finished; i++){
      for(let j = 0; j < 4 && !finished; j++){
        if(getSquare((winArr[i].x * j) + posX, (winArr[i].y * j) + posY, grid) === "playerTwo"){
          amount++
          if(amount === 4 && !rules.gameOver){
            changeRules({...rules, gameOver : true, winner : "Two"})
            return true;
          }
        }else{
          if(amount < 4){
            amount = 0;
            changeRules({...rules, player : "playerOne"})
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
          if(amount === 4 && !rules.gameOver){
            changeRules({...rules, gameOver : true, winner : "One"})
            return true;
          }
        }else{
          if(amount < 4){
            amount = 0;
            changeRules({...rules, player : "playerTwo"})
            break;
          }
        }
      }
    }
  }
}

function resetGame(e, grid, changeGrid, rules, changeRules){
  changeRules({player : "playerOne", gameOver : false, winner : ""})
  changeGrid(makeGrid());
}

function Grid() {
  const [grid, changeGrid] = useState(makeGrid());
  const [rules, changeRules] = useState({player : "playerOne", gameOver : false, winner : ""});
  
  let resetBtn;
  if(rules.gameOver){
    resetBtn = (<button onClick={(e) => resetGame(e, grid, changeGrid, rules, changeRules)}><h1>Reset Game</h1></button>);
  }else{
    resetBtn = null;
  }

  return (
    <div className="flex">
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
