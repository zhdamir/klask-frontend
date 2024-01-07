import React, { useState, useEffect } from 'react';
import TeilnehmerBearbeiten from './TeilnehmerBearbeiten';
import '../styles/SpielerUebersicht.css';

function SpielerUebersicht() {
  const [teilnehmerList, setTeilnehmerList] = useState([]);
  const [bereichOptions, setBereichOptions] = useState([]); // State to hold fetched Bereich options
  const [rolleOptions, setRolleOptions] = useState([]); // State to hold fetched Rolle options
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTeilnehmer, setSelectedTeilnehmer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Teilnehmer data
        const teilnehmerResponse = await fetch('http://localhost:5222/api/teilnehmer');
        const teilnehmerData = await teilnehmerResponse.json();

        // Fetch Bereich data
        const bereichResponse = await fetch('http://localhost:5222/api/bereich');
        const bereichData = await bereichResponse.json();
        setBereichOptions(bereichData);

        // Fetch Rolle data
        const rolleResponse = await fetch('http://localhost:5222/api/benutzerrolle');
        const rolleData = await rolleResponse.json();
        setRolleOptions(rolleData);

        // Daten für jeden Teilnehmer holen
        const enrichedData = await Promise.all(
          teilnehmerData.map(async (teilnehmer) => {
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
  }, [teilnehmerList]);//teilnehmerList hinzugefügt
  //now useEffect runs whenever teilnehmerList changes

  const handleEditClick = (teilnehmer) => {
    setSelectedTeilnehmer(teilnehmer);
    setEditDialogOpen(true);
  };

  const handleUpdateTeilnehmer = (teilnehmerId, updatedTeilnehmer) => {
    setTeilnehmerList((prevList) => {
      const updatedList = prevList.map((teilnehmer) =>
        teilnehmer.teilnehmerId === teilnehmerId ? { ...teilnehmer, ...updatedTeilnehmer } : teilnehmer
      );
      return updatedList;
    });
  };

  return (
    <div className='teilnehmer-flex-container'>
       <div className="teilnehmerListe">
      <h2>Teilnehmerliste</h2>
      <table>
        <thead>
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Email</th>
            <th>BereichName</th>
            <th>BezeichnungRolle</th>
            <th>Bearbeiten</th>
          </tr>
        </thead>
        <tbody>
          {/*teilnehmerList
            .sort((a, b) => a.teilnehmerId - b.teilnehmerId) // Sort by teilnehmerId*/
            /*teilnehmerList
  .sort((a, b) => a.nachname.localeCompare(b.nachname)) // Sort by last name*/
            teilnehmerList
            .sort((a, b) => a.vorname.localeCompare(b.vorname)) // Sort by first name
            .map((teilnehmer) => (
            <tr key={teilnehmer.teilnehmerId}>
              <td>{teilnehmer.vorname}</td>
              <td>{teilnehmer.nachname}</td>
              <td>{teilnehmer.email}</td>
              <td>{teilnehmer.bereichName}</td>
              <td>{teilnehmer.bezeichnungRolle}</td>
              <td>
                <button className="submitScore" onClick={() => handleEditClick(teilnehmer)}>Bearbeiten</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editDialogOpen && (
        <TeilnehmerBearbeiten
        open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          teilnehmer={selectedTeilnehmer}
          onUpdateTeilnehmer={handleUpdateTeilnehmer}
          bereichOptions={bereichOptions}
          rolleOptions={rolleOptions}
        />
      )}
      </div>
    </div>
  );
}

export default SpielerUebersicht;
