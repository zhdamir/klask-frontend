
//import TurnierCaller from './components/TurnierCaller';
import './styles/style.css';
import SpielerUebersicht from './components/SpielerUebersicht';
import TurnierUebersicht from './components/TurnierUebersicht';
import Uebersicht from './components/Uebersicht';
import { BrowserRouter, Route, Router, Routes} from 'react-router-dom';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeilnehmerAnlegen from './components/TeilnehmerAnlegen';
import TurnierAnlegen from './components/TurnierAnlegen';
import Header from './components/Header';
import Footer from './components/Footer';
import TurnierErgebnisse from './components/TurnierErgebnisse';
import './styles/Header.css';
import UebersichtHistorie from './components/UebersichtHistorie';


function App(){

  const navigate = useNavigate();


  return(
    <>
    <div className='app-container'>
     <Header/>
    <div className="content">
      <Routes>
        <Route path="/SpielerUebersicht" element={<SpielerUebersicht/>} /> 
        <Route path="/TurnierUebersicht" element={<TurnierUebersicht/>} /> 
        <Route path="/TurnierErgebnisse" element={<TurnierErgebnisse/>} /> 
        <Route path="/Uebersicht" element={<Uebersicht/>} /> 
        <Route path="/TeilnehmerAnlegen" element={<TeilnehmerAnlegen/>} /> 
        <Route path="/TurnierAnlegen" element={<TurnierAnlegen/>} /> 
        <Route path="/UebersichtHistorie/:turnierId" element={<UebersichtHistorie/>} /> 
      </Routes>
      </div>
      </div>
      <Footer className="footer"/>
      </>
  )
}

export default App;


