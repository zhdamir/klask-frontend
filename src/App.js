import React from 'react';
//import TurnierCaller from './components/TurnierCaller';
import './style.css';
import LoginPage from './components/LoginPage';
import SpielerUebersicht from './components/SpielerUebersicht';
import TurnierUebersicht from './components/TurnierUebersicht';
import Uebersicht from './components/Uebersicht';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import TeilnehmerAnlegen from './components/TeilnehmerAnlegen';
import TurnierAnlegen from './components/TurnierAnlegen';
import Header from './components/Header';
import Footer from './components/Footer';

import './Header.css';


function App(){
  return(
    <>
    <div className='app-container'>
     <Header/>
    <div className="content">
      <Routes>
        <Route path="/LoginPage" element={<LoginPage/>} />
        <Route path="/SpielerUebersicht" element={<SpielerUebersicht/>} /> {/* Define a route for SpielerUebersicht */}
        <Route path="/TurnierUebersicht" element={<TurnierUebersicht/>} /> {/* Define a route for TurnierUebersicht */}
        <Route path="/Uebersicht" element={<Uebersicht/>} /> {/* Define a route for Uebersicht */}
        {/* Other routes for additional pages, if needed */}
        <Route path="/TeilnehmerAnlegen" element={<TeilnehmerAnlegen/>} /> {/* Define a route for CreateTeilnehmer */}
        <Route path="/TurnierAnlegen" element={<TurnierAnlegen/>} /> {/* Define a route for CreateTeilnehmer */}
      </Routes>
      </div>
      </div>
      <Footer className="footer"/>
      </>
     
      
  )
}

export default App;


