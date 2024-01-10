import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TurnierAnlegen.css';
const TurnierAnlegen = () => {

  // States für die Eingabefelder des Turniers
  const [turnierTitel, setTurnierTitel] = useState('');
  const [startDatum, setStartDatum] = useState('');
  const [endDatum, setEndDatum] = useState('');
  const [anzahlGruppen, setAnzahlGruppen] = useState('');
  const [isActive, setIsActive] = useState(false);
  
  // State zur Verwaltung der Sichtbarkeit des TeilnehmerlisteDialogs
  const [teilnehmerDialogOpen, setTeilnehmerDialogOpen] = useState(false);

  // State zum Speichern der Liste der Teilnehmer
  const [teilnehmerList, setTeilnehmerList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Funktion zum Abrufen der Teilnehmerdaten
    const fetchData = async () => {
      try {
        // Teilnehmerdaten abrufen
        const teilnehmerResponse = await fetch('http://localhost:5222/api/teilnehmer');
        const teilnehmerData = await teilnehmerResponse.json();
        // Teilnehmerliste setzen
        setTeilnehmerList(teilnehmerData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Initial fetch
  }, []);

   // Funktion zum Erstellen eines Turniers
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
          isActive: JSON.parse(isActive), // In Boolean konvertieren
        }),
      });

      // Überprüfen, ob die Anfrage erfolgreich war
      if (response.ok) {
        // Turnier erfolgreich erstellt, Navigation zur Turnierübersicht
        navigate("/TurnierUebersicht");
      } else {
         // Fehler behandeln
        console.error('Error creating Turnier:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating Teilnehmer:', error);
    }
  };


// JSX für die Komponente
  return (
    <div className='turnier-container'>
      <h1 className='turnier-anlegen'> Turnier anlegen</h1>
     
        <label className='label-titel'>Titel:</label>
        <input className='input-titel' type="text" value={turnierTitel} onChange={(e) => setTurnierTitel(e.target.value)} />
      
     
        <label className='label-startdatum'>Start Datum:</label>
        <input className='input-startdatum' type="date" value={startDatum} onChange={(e) => setStartDatum(e.target.value)} />
     
        <label className='label-enddatum'>End Datum:</label>
        <input className='input-enddatum' type="date" value={endDatum} onChange={(e) => setEndDatum(e.target.value)} />
      
        <label className='label-anzahl'>Anzahl Gruppen:</label>
        <input className='input-anzahl' type="text" value={anzahlGruppen} onChange={(e) => setAnzahlGruppen(e.target.value)} />
     
        <label className='label-status'>Status:</label>
        <select className='input-status' value={isActive} onChange={(e) => setIsActive(e.target.value)}>
          <option value="true">Aktiv</option>
          <option value="false">Inaktiv</option>
        </select>
     

      <button className="btn-anlegen" onClick={handleCreateTurnier}>Turnier anlegen</button>

    </div>
  );
};

export default TurnierAnlegen;
