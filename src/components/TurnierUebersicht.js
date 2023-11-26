// Uebersicht.jsx

import React, { useState, useEffect } from 'react';
import TeilnehmerlisteDialog from './TeilnehmerlisteDialog';

import "../TurnierUebersicht.css";

function TurnierUebersicht() {
  const [turnierList, setTurnierList] = useState([]);
  const [teilnehmerDialogOpen, setTeilnehmerDialogOpen] = useState(false);
  const [selectedTurnier, setSelectedTurnier] = useState(null);
  const [teilnehmerList, setTeilnehmerList] = useState([]);

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
  }, []);// Dependency array should be empty, as we only want to fetch data once on component mount

  const handleTeilnehmerListeClick = (turnier) => {
    // Check if turnier is not null before setting the selectedTurnier
  if (turnier) {
    setSelectedTurnier(turnier);
    //console.log("Turnier selected method hanldeTeilnehmerListeClick"+turnier);
    setTeilnehmerDialogOpen(true);
  } else {
    console.error('Error: Selected turnier is null.');
  }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  
  return (
    <div>
      <h1>Turnierliste</h1>
      <table>
        <thead>
          <tr>
            <th className="cellWithSpace">Turniertitel</th>
            <th className="cellWithSpace">Startdatum</th>
            <th className="cellWithSpace">Enddatum</th>
            <th className="cellWithSpace">Anzahl Gruppen</th>
            <th className="cellWithSpace">Status</th>
            <th className="cellWithSpace">Teilnehmer Hinzufügen</th>
            <th className="cellWithSpace">Start</th>
            <th className="cellWithSpace">Vorrunde</th>
            <th className="cellWithSpace">Finale</th>
          </tr>
        </thead>
        <tbody>
          {turnierList
            .sort((a, b) => a.id - b.id)
            .map((turnier) => (
              <tr key={turnier.id}>
                <td className="cellWithSpace">{turnier.turnierTitel}</td>
                <td className="cellWithSpace">{formatDate(turnier.startDatum)}</td>
                <td className="cellWithSpace">{formatDate(turnier.endDatum)}</td>
                <td className="cellWithSpace">{turnier.anzahlGruppen}</td>

                <td className="cellWithSpace">{turnier.isActive? 'Aktiv':'Inaktiv'}</td>
                <td>
                  < button className="cellWithSpace" onClick={() => handleTeilnehmerListeClick(turnier)}>Teilnehmer hinzufügen</button>
                </td>
                <td>
                  < button className="cellWithSpace" onClick={''}>Start</button>
                </td>
                <td>
                  < button className="cellWithSpace" onClick={''}>Vorrunde</button>
                </td>
                <td>
                  < button className="cellWithSpace" onClick={''}>Finale</button>
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
  );
}

export default TurnierUebersicht;
