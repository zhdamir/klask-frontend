

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TurnierAnlegen.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TurnierAnlegen = () => {
  const [turnierTitel, setTurnierTitel] = useState('');
  const [startDatum, setStartDatum] = useState(new Date());
  const [endDatum, setEndDatum] = useState(new Date());
  const [anzahlGruppen, setAnzahlGruppen] = useState('');
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();



  const handleCreateTurnier = async () => {
    try {
      const selectedStartDate = startDatum.toISOString();
      const selectedEndDate = endDatum.toISOString();

      const response = await fetch('http://localhost:5222/api/turnier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          turnierTitel,
          startDatum: selectedStartDate,
          endDatum: selectedEndDate,
          anzahlGruppen,
          isActive: JSON.parse(isActive),
        }),
      });

      if (response.ok) {
        navigate("/TurnierUebersicht");
      } else {
        console.error('Error creating Turnier:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating Teilnehmer:', error);
    }
  };

  return (
    <div className='turnier-container'>
      <h1 className='turnier-anlegen'> Turnier anlegen</h1>

      <label className='label-titel'>Titel:</label>
      <input className='input-titel' type="text" value={turnierTitel} onChange={(e) => setTurnierTitel(e.target.value)} />

      <label className='label-startdatum'>Start Datum:</label>
      <DatePicker
        selected={startDatum}
        onChange={(date) => setStartDatum(date)}
        dateFormat="dd/MM/yyyy"
        wrapperClassName='custom-datepicker-wrapper'
  className='input-startdatum'
      />

      <label className='label-enddatum'>End Datum:</label>
      <DatePicker
        selected={endDatum}
        onChange={(date) => setEndDatum(date)}
        dateFormat="dd/MM/yyyy"
        wrapperClassName='custom-datepicker-wrapper2'
  className='input-enddatum'
      />

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

