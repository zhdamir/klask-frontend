
//import TurnierCaller from './components/TurnierCaller';
import './style.css';
import LoginPage from './components/LoginPage';
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
import './Header.css';
import UebersichtHistorie from './components/UebersichtHistorie';


function App(){

  const navigate = useNavigate();

  /*useEffect(() => {
    // Navigate to the default route when the component mounts
    navigate('/Uebersicht');
  }, [navigate]);*/

  return(
    <>
    <div className='app-container'>
     <Header/>
    <div className="content">
      <Routes>
        <Route path="/SpielerUebersicht" element={<SpielerUebersicht/>} /> {/* Define a route for SpielerUebersicht */}
        <Route path="/TurnierUebersicht" element={<TurnierUebersicht/>} /> {/* Define a route for TurnierUebersicht */}
        <Route path="/TurnierErgebnisse" element={<TurnierErgebnisse/>} /> {/* Define a route for TurnierUebersicht */}
        <Route path="/Uebersicht" element={<Uebersicht/>} /> {/* Define a route for Uebersicht */}
        {/* Other routes for additional pages, if needed */}
        <Route path="/TeilnehmerAnlegen" element={<TeilnehmerAnlegen/>} /> {/* Define a route for CreateTeilnehmer */}
        <Route path="/TurnierAnlegen" element={<TurnierAnlegen/>} /> {/* Define a route for CreateTeilnehmer */}
        <Route path="/UebersichtHistorie/:turnierId" element={<UebersichtHistorie/>} /> {/* Define a route for TurnierUebersicht */}
      </Routes>
      </div>
      </div>
      <Footer className="footer"/>
      </>
  )
}

export default App;


