// Uebersicht.jsx

import React, { useState, useEffect } from 'react';
import TeilnehmerlisteDialog from './TeilnehmerlisteDialog';

function Uebersicht() {
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

  
  return (
    <div>
      <h1>Turnierliste</h1>
      <table>
        <thead>
          <tr>
            <th>Turniertitel</th>
            <th>Startdatum</th>
            <th>Enddatum</th>
            <th>Anzahl Gruppen</th>
          </tr>
        </thead>
        <tbody>
          {turnierList
            .sort((a, b) => a.id - b.id)
            .map((turnier) => (
              <tr key={turnier.id}>
                <td>{turnier.turnierTitel}</td>
                <td>{turnier.startDatum}</td>
                <td>{turnier.endDatum}</td>
                <td>{turnier.anzahlGruppen}</td>
                <td>
                  <button onClick={() => handleTeilnehmerListeClick(turnier)}>Teilnehmer hinzufügen</button>
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

export default Uebersicht;
