
import React, { useState, useEffect } from 'react';
import TeilnehmerlisteDialog from './TeilnehmerlisteDialog';
import { useNavigate } from 'react-router-dom';

import "../styles/TurnierUebersicht.css";
import "../styles/Uebersicht.css";

function TurnierUebersicht() {

  //States für die Liste der Turniere, das ausgewählte Turnier, die Teilnehmerliste und die Sichtbarkeit des Teilnehmerdialogfelds
  const [turnierList, setTurnierList] = useState([]);
  const [teilnehmerDialogOpen, setTeilnehmerDialogOpen] = useState(false);
  const [selectedTurnier, setSelectedTurnier] = useState(null);
  const [teilnehmerList, setTeilnehmerList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch Teilnehmer data
        const teilnehmerResponse = await fetch('http://localhost:5222/api/teilnehmer');
        const teilnehmerData = await teilnehmerResponse.json();
        setTeilnehmerList(teilnehmerData);

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

   // Funktion zum Handhaben des Klicks auf "Teilnehmerliste" Button
  const handleTeilnehmerListeClick = (turnier) => {
   // Überprüfen, ob das ausgewählte Turnier nicht null ist, bevor selectedTurnier gesetzt wird
   if (turnier) {
    setSelectedTurnier(turnier);
    setTeilnehmerDialogOpen(true);
  } else {
    console.error('Error: Selected turnier is null.');
  }
  };

  // Funktion zum Formatieren des Datums
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Funktionen zum Starten vom Turnier
  const handleStartClick = async (turnierId) => {
    try {
      const response = await fetch(`http://localhost:5222/api/turnier/startTurnier?turnierId=${turnierId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Erfolgreich gestartetes Turnier
       navigate("/TurnierUebersicht");
        console.log('Turnier started successfully');
      } else {
        //Fehler beim Starten des Turniers
        console.error('Error starting turnier:', response.statusText);
      }
      navigate("/TurnierUebersicht");
    } catch (error) {
      console.error('Error starting turnier:', error.message);
    }
  };

  // Funktionen zum Starten von der Vorrunde
  const handleVorrundeClick = async (turnierId) => {
    try {
      const response = await fetch(`http://localhost:5222/api/runde/startVorrunde?turnierId=${turnierId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
       navigate("/TurnierUebersicht");
        console.log('Vorrunde started successfully');
      } else {
        console.error('Error starting Vorrunde:', response.statusText);
      }
      navigate("/TurnierUebersicht");
    } catch (error) {
      console.error('Error starting Vorrunde:', error.message);
    }
  };

  // Funktionen zum Starten von der finalen Runde
  const handleFinaleClick = async (turnierId) => {
    try {
      const response = await fetch(`http://localhost:5222/api/runde/startFinale?turnierId=${turnierId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
       navigate("/TurnierUebersicht");
        console.log('Finale started successfully');
      } else {
        console.error('Error starting Finale:', response.statusText);
      }
      navigate("/TurnierUebersicht");
    } catch (error) {
      console.error('Error starting Finale:', error.message);
    }
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
            <th >Teilnehmer Hinzufügen</th>
            <th >Start</th>
            <th >Vorrunde</th>
            <th >Finale</th>
          </tr>
        </thead>
        <tbody>
          {turnierList
            .sort((a, b) => b.id - a.id)
            .map((turnier) => (
              <tr key={turnier.id}>
                <td >{turnier.turnierTitel}</td>
                <td >{formatDate(turnier.startDatum)}</td>
                <td >{formatDate(turnier.endDatum)}</td>
                <td >{turnier.anzahlGruppen}</td>

                <td >{turnier.isActive? 'Aktiv':'Inaktiv'}</td>
                <td >
                  < button className="submitScore" onClick={() => handleTeilnehmerListeClick(turnier)}>Teilnehmer hinzufügen</button>
                </td>
                <td>
                  < button className="submitScore" onClick={()=>handleStartClick(turnier.id)}>Start</button>
                </td>
                <td>
                  < button className="submitScore" onClick={()=>handleVorrundeClick(turnier.id)}>Vorrunde</button>
                </td>
                <td>
                  < button className="submitScore" onClick={()=>handleFinaleClick(turnier.id)}>Finale</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {teilnehmerDialogOpen && (
        <TeilnehmerlisteDialog
          open={teilnehmerDialogOpen}
          onClose={() => setTeilnehmerDialogOpen(false)}
          teilnehmerList={teilnehmerList}
          turnier={selectedTurnier}
        />
      )}
    </div>
    </div>
  );
}

export default TurnierUebersicht;
