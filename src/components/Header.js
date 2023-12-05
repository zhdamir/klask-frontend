import React from "react";
import { Link } from 'react-router-dom'; 
import '../Header.css';
import'../style.css';

const Header = () => {
    return (
      <>
   
        <div className="header">
          <div className="logo">
              <h2 className="ueberschrift">Klask Turnier</h2>
              <img src="/klask-logo.png" alt=""/>
          </div>
          <div className="list-items">
              <div className="main-list">
                  <button className="menu-item"><Link className="links" to="/Uebersicht">Übersicht</Link></button>
                  <button className="menu-item"> <Link className="links" to="/TurnierAnlegen">Turnier anlegen</Link></button>
                  <button className="verwalten">Turnier verwalten
                      <div className="nav">
                          <ul className="dropdown">
                              <li><Link className="links" to="/TurnierUebersicht">Turnier Übersicht</Link></li>
                              <li><Link className="links" to="/Uebersicht">Ergebnisse eintragen</Link></li>
                          </ul>
                      </div>
                  </button>
                  <button className="menu-item verwalten"> Spieler verwalten
                      <div className="nav">
                          <ul className="dropdown">
                              <li><Link className="links" to="/SpielerUebersicht">Spieler bearbeiten</Link></li>
                              <li><Link className="links" to="/TeilnehmerAnlegen">Neuen Spieler anlegen</Link></li>
                          </ul>
                      </div>
                  </button>
                  <button className="menu-item">Turnierergebnisse</button>
              </div>
              </div>
        </div>
  </>
    );
  };


  export default Header;