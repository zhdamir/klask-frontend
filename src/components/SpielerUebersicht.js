import React, { useState, useEffect } from 'react';

function SpielerUebersicht() {
  const [teilnehmerList, setTeilnehmerList] = useState([]);
//Test
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5222/api/teilnehmer');
        const data = await response.json();

        // daten für jeden Teilnehmer holen
        const enrichedData = await Promise.all(
          data.map(async (teilnehmer) => {
            const bereichResponse = await fetch(`http://localhost:5222/api/bereich/${teilnehmer.bereichId}`);
            const bereichData = await bereichResponse.json();

            const rolleResponse = await fetch(`http://localhost:5222/api/benutzerrolle/${teilnehmer.rolleId}`);
            const rolleData = await rolleResponse.json();

            return {
              ...teilnehmer,
              bereichName: bereichData.bereichName,
              bezeichnungRolle: rolleData.bezeichnungRolle,
            };
          })
        );

        setTeilnehmerList(enrichedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>List of Teilnehmer</h1>
      <table>
        <thead>
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Email</th>
            <th>BereichName</th>
            <th>BezeichnungRolle</th>
          </tr>
        </thead>
        <tbody>
          {teilnehmerList.map((teilnehmer) => (
            <tr key={teilnehmer.teilnehmerId}>
              <td>{teilnehmer.vorname}</td>
              <td>{teilnehmer.nachname}</td>
              <td>{teilnehmer.email}</td>
              <td>{teilnehmer.bereichName}</td>
              <td>{teilnehmer.bezeichnungRolle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpielerUebersicht;

