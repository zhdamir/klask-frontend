import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TurnierAnlegen = () => {
  const [turnierTitel, setTurnierTitel] = useState('');
  const [startDatum, setStartDatum] = useState('');
  const [endDatum, setEndDatum] = useState('');
  const [anzahlGruppen, setAnzahlGruppen] = useState('');
  const [selectedTeilnehmer, setSelectedTeilnehmer] = useState('');
  const [teilnehmer, setTeilnehmer] = useState([]);
 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Teilnehmer data
        const teilnehmerResponse = await fetch('http://localhost:5222/api/teilnehmer');
        const teilnehmerData = await teilnehmerResponse.json();
        setTeilnehmer(teilnehmerData);
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
        <select value={selectedTeilnehmer} onChange={(e) => setSelectedTeilnehmer(e.target.value)}>
          <option value="" disabled>Teilnehmer wählen</option>
          {teilnehmer.map((teilnehmer) => (
            <option key={teilnehmer.teilnehmerId} value={teilnehmer.teilnehmerId}>
              {teilnehmer.vorname +" "+teilnehmer.nachname}
            </option>
          ))}
        </select>
      </div>
      
      <button onClick={handleCreateTurnier}>Turnier anlegen</button>
    </div>
  );
};

export default TurnierAnlegen;
