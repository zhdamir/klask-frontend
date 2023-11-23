import React, { useState, useEffect } from 'react';
//import TeilnehmerBearbeiten from './TeilnehmerBearbeiten';

function Uebersicht() {
  const [turnierList, setTurnierList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Teilnehmer data
        const turnierResponse = await fetch('http://localhost:5222/api/turnier');
        const turnierData = await turnierResponse.json();

        

        // Daten für jeden Turnier holen
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
  }, [turnierList]);//turnierList hinzugefügt
  //now useEffect runs whenever turnierList changes

  
  

 
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
            .sort((a, b) => a.turnierId - b.turnierId) // Sort by turnierId
            .map((turnier) => (
            <tr key={turnier.turnierId}>
              <td>{turnier.turnierTitel}</td>
              <td>{turnier.startDatum}</td>
              <td>{turnier.endDatum}</td>
              <td>{turnier.anzahlGruppen}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}

export default Uebersicht;
