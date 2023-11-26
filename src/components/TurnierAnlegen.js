import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const TurnierAnlegen = () => {
  const [turnierTitel, setTurnierTitel] = useState('');
  const [startDatum, setStartDatum] = useState('');
  const [endDatum, setEndDatum] = useState('');
  const [anzahlGruppen, setAnzahlGruppen] = useState('');
  const [isActive, setIsActive] = useState(false);
  
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
          anzahlGruppen,
          isActive: JSON.parse(isActive), // Convert to boolean
        }),
      });

      if (response.ok) {
        // Turnier created successfully
        navigate("/TurnierUebersicht");
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
        <label>Status:</label>
        <select value={isActive} onChange={(e) => setIsActive(e.target.value)}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
  </div>
      <button onClick={handleCreateTurnier}>Turnier anlegen</button>
    </div>
  );
};

export default TurnierAnlegen;
