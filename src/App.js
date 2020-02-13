import React from 'react';
import Grid from "./components/Grid"
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="flex">
        <h1>Four in a row.</h1>
        <Grid />
      </div>
    </div>
  );
}

export default App;
