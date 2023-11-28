import React, { useState, useEffect } from 'react';
import '../Uebersicht.css';

function Uebersicht() {
  const [turnierList, setTurnierList] = useState([]);
  const [turnierDetails, setTurnierDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all Turniere
        const turnierResponse = await fetch('http://localhost:5222/api/turnier');
        const turnierData = await turnierResponse.json();

        // Find the active Turnier
        const activeTurnierList = turnierData.filter((turnier) => turnier.isActive);
        if (activeTurnierList.length === 0) {
          console.error('No active Turnier found.');
          return;
        }

        // Set the active turnier
        setTurnierList(activeTurnierList);

        // Fetch turnier details (groups with participants) for the active Turnier
        const detailsResponse = await fetch('http://localhost:5222/api/turnier/currentTurnierDetails');
        const detailsData = await detailsResponse.json();

        console.log('Turnier Details:', detailsData); // Log the detailsData

        setTurnierDetails(detailsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
         
        </tr>
      ))}
  </tbody>
</table>

      {/* Display groups and their associated Teilnehmer */}
      {turnierDetails.map((group) => (
        <div key={group.gruppeId}>
          <h2>{group.gruppenname}</h2>

          {/* Check if teilnehmer is defined before mapping */}
          {group.teilnehmer && group.teilnehmer.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th className="cellWithSpace">Teilnehmer Name</th>
                  {/* Add other columns as needed */}
                </tr>
              </thead>
              <tbody>
                {group.teilnehmer.map((teilnehmer) => (
                  <tr key={teilnehmer.teilnehmerId}>
                    <td className="cellWithSpace">{teilnehmer.vorname}</td>
                    {/* Add other cells for additional Teilnehmer information */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Teilnehmer available for this group.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Uebersicht;




