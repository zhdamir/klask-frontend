import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../TeilnehmerAnlegen.css';

const TeilnehmerAnlegen = () => {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [selectedBereich, setSelectedBereich] = useState('');
  const [selectedRolle, setSelectedRolle] = useState('');
  const [bereiche, setBereiche] = useState([]);
  const [rollen, setRollen] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Bereich data
        const bereichResponse = await fetch('http://localhost:5222/api/bereich');
        const bereichData = await bereichResponse.json();
        setBereiche(bereichData);

        // Fetch Rolle data
        const rolleResponse = await fetch('http://localhost:5222/api/benutzerrolle');
        const rolleData = await rolleResponse.json();
        setRollen(rolleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Initial fetch
  }, []);

  const handleCreateTeilnehmer = async () => {
    try {
      const response = await fetch('http://localhost:5222/api/teilnehmer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vorname,
          nachname,
          email,
          bereichId: selectedBereich,
          rolleId: selectedRolle,
        }),
      });

      if (response.ok) {
        navigate("/SpielerUebersicht");
      } else {
        console.error('Error creating Teilnehmer:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating Teilnehmer:', error);
    }
  };

  return (
    <div className='grid-container'>
      <h1 className="teilnehmer-anlegen">Teilnehmer anlegen</h1>
     
        <label className="label label-vorname">Vorname:</label>
        <input className="input-vorname" type="text" value={vorname} onChange={(e) => setVorname(e.target.value)} />
     
     
        <label className="label label-nachname">Nachname:</label>
        <input className="input-nachname" type="text" value={nachname} onChange={(e) => setNachname(e.target.value)} />
      
     
        <label className="label label-email">Email:</label>
        <input className="input-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      
     
        <label className="label label-bereich">Bereich:</label>
        <select className="input-bereich" value={selectedBereich} onChange={(e) => setSelectedBereich(e.target.value)}>
          <option value="" disabled>Bereich wählen</option>
          {bereiche.map((bereich) => (
            <option key={bereich.bereichId} value={bereich.bereichId}>
              {bereich.bereichName}
            </option>
          ))}
        </select>
      
    
        <label className="label label-rolle">Rolle:</label>
        <select className="input-rolle" value={selectedRolle} onChange={(e) => setSelectedRolle(e.target.value)}>
          <option value="" disabled>Rolle wählen</option>
          {rollen.map((rolle) => (
            <option key={rolle.rolleId} value={rolle.rolleId}>
              {rolle.bezeichnungRolle}
            </option>
          ))}
        </select>
     
      <button className="btn-anlegen" onClick={handleCreateTeilnehmer}>Teilnehmer anlegen</button>
    </div>
  );
};

export default TeilnehmerAnlegen;
