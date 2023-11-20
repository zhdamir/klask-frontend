import React from 'react';
//import TurnierCaller from './components/TurnierCaller';
import './style.css';
import LoginPage from './components/LoginPage';
import Uebersicht from './components/SpielerUebersicht';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateTeilnehmer from './components/CreateTeilnehmer';



function App(){
  return(
  
      <Routes>
        <Route path="/LoginPage" element={<LoginPage/>} />
        <Route path="/SpielerUebersicht" element={<Uebersicht/>} /> {/* Define a route for Uebersicht */}
        {/* Other routes for additional pages, if needed */}
        <Route path="/CreateTeilnehmer" element={<CreateTeilnehmer/>} /> {/* Define a route for CreateTeilnehmer */}

      </Routes>
     
      
  )
}

export default App;

/*
<main className='App'>
      <LoginPage/>

    </main>
*/ 
/*
function App() {
  return (
    <div className="App">
     <h1>Klask App Components here</h1>
     <TurnierCaller />
    </div>
  );
}

export default App;*/
