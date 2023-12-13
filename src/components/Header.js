import React from "react";
import { Link } from 'react-router-dom'; 
import '../Header.css';
import'../style.css';
import '../resources/fa-web/css/all.css'
const Header = () => {
    return (
      <>
   
        <div className="header">
          <div className="logo">
             
              <img className="header-logo" src="/klask-logo.png" alt=""/>
              <h2 className="ueberschrift">Klask Turnier</h2>
          </div>
          <div className="list-items">
              <ul className="main-list">
                  <li className="menu-item"><i class="fa-solid fa-house"></i><Link className="links" to="/Uebersicht">Übersicht</Link></li>
                  <li className="menu-item"><i class="fa-solid fa-pen"></i><Link className="links" to="/TurnierAnlegen">Turnier anlegen</Link></li>
                  <li className="menu-item verwalten" tabIndex={1}><i class="fa-solid fa-folder-tree"></i>Turnier verwalten<i class="fa-solid fa-chevron-down"></i>
                        <ul className="dropdown">
                            <li><Link className="links" to="/TurnierUebersicht">Turnier Übersicht</Link></li>
                            <li><Link className="links" to="/Uebersicht">Ergebnisse eintragen</Link></li>
                        </ul>
                  </li>
                  <li className="menu-item verwalten" tabIndex={2}><i class="fa-solid fa-user"></i> Spieler verwalten<i class="fa-solid fa-chevron-down"></i>
                        <ul className="dropdown">
                            <li><Link className="links" to="/SpielerUebersicht">Spieler bearbeiten</Link></li>
                            <li><Link className="links" to="/TeilnehmerAnlegen">Neuen Spieler anlegen</Link></li>
                        </ul>
                  </li>
                  <li className="menu-item"><i class="fa-solid fa-chart-simple"></i><Link className="links" to="/TurnierErgebnisse">Turnierergebnisse</Link></li>
              </ul>
              </div>
        </div>
  </>
    );
  };


  export default Header;