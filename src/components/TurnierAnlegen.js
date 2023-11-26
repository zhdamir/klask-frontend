import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeilnehmerlisteDialog from './TeilnehmerlisteDialog';

const TurnierAnlegen = () => {
  const [turnierTitel, setTurnierTitel] = useState('');
  const [startDatum, setStartDatum] = useState('');
  const [endDatum, setEndDatum] = useState('');
  const [anzahlGruppen, setAnzahlGruppen] = useState('');
  
  // State to manage the visibility of the TeilnehmerlisteDialog
  const [teilnehmerDialogOpen, setTeilnehmerDialogOpen] = useState(false);

  // State to store the list of Teilnehmer
  const [teilnehmerList, setTeilnehmerList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Teilnehmer data
        const teilnehmerResponse = await fetch('http://localhost:5222/api/teilnehmer');
        const teilnehmerData = await teilnehmerResponse.json();
        setTeilnehmerList(teilnehmerData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Initial fetch
  }, []);

  const handleCreateTurnier = async () => {
    try {
      const response = await fetch('http://localhost:5222/api/turnier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          turnierTitel,
          startDatum,
          endDatum,
          anzahlGruppen
        }),
      });

      if (response.ok) {
        // Turnier created successfully
        navigate("/Uebersicht");
      } else {
        // Handle error, show error message, etc.
        console.error('Error creating Turnier:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating Teilnehmer:', error);
    }
  };
// Handler to open the TeilnehmerlisteDialog
const handleTeilnehmerListeClick = () => {
  setTeilnehmerDialogOpen(true);
};

// Handler to handle selected Teilnehmer from the dialog
const handleTeilnehmerSelect = (selectedTeilnehmer) => {
  // Handle selected Teilnehmer logic here
  console.log('Selected Teilnehmer:', selectedTeilnehmer);
};

  return (
    <div>
      <h1>Create Turnier</h1>
      <div>
        <label>Titel:</label>
        <input type="text" value={turnierTitel} onChange={(e) => setTurnierTitel(e.target.value)} />
      </div>
      <div>
        <label>Start Datum:</label>
        <input type="date" value={startDatum} onChange={(e) => setStartDatum(e.target.value)} />
      </div>
      <div>
        <label>End Datum:</label>
        <input type="date" value={endDatum} onChange={(e) => setEndDatum(e.target.value)} />
      </div>
      <div>
        <label>Anzahl Gruppen:</label>
        <input type="text" value={anzahlGruppen} onChange={(e) => setAnzahlGruppen(e.target.value)} />
      </div>
      <div>
        <label>Teilnehmerliste:</label>
        <td>
            <button onClick={handleTeilnehmerListeClick}>Teilnehmerliste</button>
        </td>
        {/* TeilnehmerlisteDialog */}
      <TeilnehmerlisteDialog
        open={teilnehmerDialogOpen}
        onClose={() => setTeilnehmerDialogOpen(false)}
        onSelectTeilnehmer={handleTeilnehmerSelect}
        teilnehmerList={teilnehmerList}
      />
      </div>
      <button onClick={handleCreateTurnier}>Turnier anlegen</button>
    </div>
  );
};

export default TurnierAnlegen;
