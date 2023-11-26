// Uebersicht.jsx

import React, { useState, useEffect } from 'react';
import "../Uebersicht.css";

function Uebersicht() {
    const [turnierList, setTurnierList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  //Filter only active tournaments
  const activeTurnierList = turnierList.filter((turnier) => turnier.isActive);
  
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
          {activeTurnierList
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
    </div>
  );
}

export default Uebersicht;
