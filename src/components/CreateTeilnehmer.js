import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTeilnehmer = () => {
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
        // Teilnehmer created successfully
        // You may redirect or show a success message here
        navigate("/Uebersicht");
      } else {
        // Handle error, show error message, etc.
        console.error('Error creating Teilnehmer:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating Teilnehmer:', error);
    }
  };

  return (
    <div>
      <h1>Create Teilnehmer</h1>
      <div>
        <label>Vorname:</label>
        <input type="text" value={vorname} onChange={(e) => setVorname(e.target.value)} />
      </div>
      <div>
        <label>Nachname:</label>
        <input type="text" value={nachname} onChange={(e) => setNachname(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Bereich:</label>
        <select value={selectedBereich} onChange={(e) => setSelectedBereich(e.target.value)}>
          <option value="" disabled>Select Bereich</option>
          {bereiche.map((bereich) => (
            <option key={bereich.bereichId} value={bereich.bereichId}>
              {bereich.bereichName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Rolle:</label>
        <select value={selectedRolle} onChange={(e) => setSelectedRolle(e.target.value)}>
          <option value="" disabled>Select Rolle</option>
          {rollen.map((rolle) => (
            <option key={rolle.rolleId} value={rolle.rolleId}>
              {rolle.bezeichnungRolle}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleCreateTeilnehmer}>Create Teilnehmer</button>
    </div>
  );
};

export default CreateTeilnehmer;
