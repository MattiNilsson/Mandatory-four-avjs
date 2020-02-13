import React, { useState } from 'react';

function makeGrid(){
  let newGrid = []
  for(let i = 0; i < 7; i++){
    newGrid[i] = [];
    for(let j = 0; j < 6; j++){
      newGrid[i][j] = "false";
    }
  }
  return newGrid
}

function placeMarker(e, grid, changeGrid, player, changePlayer){
  let newID = e.target.id
  if(newID !== "wrongParent"){
    let newGrid = [...grid];
    if(newGrid[newID][0] !== "false"){
      console.error("Already Filled");
      return
    }
    for(let i = 0; i < 7; i++){
      if(newGrid[newID][i] !== "false"){
        newGrid[newID][i - 1] = player;
        break;
      }
      if(i === newGrid[newID].length - 1){
        newGrid[newID][i] = player;
        break;
      }
    }
    console.log(newGrid);
    changeGrid(newGrid);
    if(player === "playerOne"){
      changePlayer("playerTwo")
    }else{
      changePlayer("playerOne")
    }
    console.log(grid);
  }else{
    console.error("it happened")
  }
}

function Grid() {
  const [grid, changeGrid] = useState(makeGrid());
  const [player, changePlayer] = useState("playerOne")

  console.table(grid)

  return (
    <div className="grid" id="wrongParent">
      {grid.map((column, colId) => {
        return (
        <div 
          key={colId} 
          onClick={(e) => {placeMarker(e, grid, changeGrid, player, changePlayer)}} 
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
  );
}

export default Grid;
