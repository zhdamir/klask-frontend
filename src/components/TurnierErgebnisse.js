
import React, { useState, useEffect } from 'react';
import TeilnehmerlisteDialog from './TeilnehmerlisteDialog';
import { useNavigate } from 'react-router-dom';
import UebersichtHistorie from './UebersichtHistorie';

import "../styles/TurnierUebersicht.css";
import "../styles/Uebersicht.css";

function TurnierErgebnisse() {

  //States für die Liste der Turniere und das ausgewählte Turnier
  const [turnierList, setTurnierList] = useState([]);
  const [selectedTurnier, setSelectedTurnier] = useState(null);
  const navigate = useNavigate();
  const [selectedTurnierId, setSelectedTurnierId] = useState(null);

// useEffekt für das Abrufen der Turnierdaten
  useEffect(() => {
    const fetchData = async () => {
      try {

 // Turnierdaten abrufen
        const turnierResponse = await fetch('http://localhost:5222/api/turnier');
        const turnierData = await turnierResponse.json();

        // Daten für jedes Turnier anreichern (derzeit nicht benötigt)
        const enrichedData = await Promise.all(
          turnierData.map(async (turnier) => {
            return {
              ...turnier
            };
          })
        );
        // Turnierliste setzen
        setTurnierList(enrichedData);
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

   // Funktion zum Handhaben des Klicks auf "Ergebnisse einsehen"
  const handleErgebnisseClick = (turnier) => {
     // Überprüfen, ob das ausgewählte Turnier nicht null ist, bevor die selectedTurnierId gesetzt wird
  if (turnier) {
    setSelectedTurnierId(turnier.id);
    // Navigieren zur UebersichtHistorie mit der ausgewählten turnierId
    navigate(`/UebersichtHistorie/${turnier.id}`);
  } else {
    console.error('Error: Selected turnier is null.');
  }
  };

  // Funktion zum Formatieren des Datums
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

   // JSX für die Komponente
  return (
    <div className='turnier-flex-container'>
    <div className='turnierListe'>
      <h2 className='headerTable'>Turnierliste</h2>
      <table>
        <thead>
          <tr>
            <th >Turniertitel</th>
            <th>Startdatum</th>
            <th >Enddatum</th>
            <th >Anzahl Gruppen</th>
            <th >Status</th>
            <th >Ergebnisse einsehen</th>
          </tr>
        </thead>
        <tbody>
          {turnierList
          .filter((turnier) => !turnier.isActive) // Filter only inactive Turniere
            .sort((a, b) => a.id - b.id)
            .map((turnier) => (
              <tr key={turnier.id}>
                <td >{turnier.turnierTitel}</td>
                <td >{formatDate(turnier.startDatum)}</td>
                <td >{formatDate(turnier.endDatum)}</td>
                <td >{turnier.anzahlGruppen}</td>

                <td >{turnier.isActive? 'Aktiv':'Inaktiv'}</td>
                <td >
                  < button className="submitScore" onClick={() => handleErgebnisseClick(turnier)} >Ergebnisse einsehen</button>
                </td>
               
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default TurnierErgebnisse;
