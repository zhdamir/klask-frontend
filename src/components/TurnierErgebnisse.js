
import React, { useState, useEffect } from 'react';
import TeilnehmerlisteDialog from './TeilnehmerlisteDialog';
import { useNavigate } from 'react-router-dom';
import UebersichtHistorie from './UebersichtHistorie';

import "../styles/TurnierUebersicht.css";

function TurnierErgebnisse() {
  const [turnierList, setTurnierList] = useState([]);
  const [selectedTurnier, setSelectedTurnier] = useState(null);
  const navigate = useNavigate();
  const [selectedTurnierId, setSelectedTurnierId] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {


        //fetch Turnier Data
        const turnierResponse = await fetch('http://localhost:5222/api/turnier');
        const turnierData = await turnierResponse.json();

        const enrichedData = await Promise.all(
          turnierData.map(async (turnier) => {
            return {
              ...turnier
            };
          })
        );
        
        setTurnierList(enrichedData);
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleErgebnisseClick = (turnier) => {
     // Check if turnier is not null before setting the selectedTurnierId
  if (turnier) {
    setSelectedTurnierId(turnier.id);
    // navigate to move to the UebersichtHistorie with the selected turnierId
    navigate(`/UebersichtHistorie/${turnier.id}`);
  } else {
    console.error('Error: Selected turnier is null.');
  }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  
  return (
    <div className='turnier-flex-container'>
    <div className='turnierListe'>
      <h2>Turnierliste</h2>
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
