import React, { useState, useEffect } from 'react';
import '../Uebersicht.css';

function Uebersicht() {
  const [turnierList, setTurnierList] = useState([]);
  const [gruppenrundenDetails, setgruppenrundenDetails] = useState([]);
  const [gruppenDetails, setGruppenDetails] = useState([]);
  const [activeTurnierFound, setActiveTurnierFound] = useState(true);

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
          setActiveTurnierFound(false);
          return;
        }

        // Set the active turnier
        setTurnierList(activeTurnierList);

        // Fetch turnier details (groups with participants) for the active Turnier
        const gruppenResponse = await fetch('http://localhost:5222/api/turnier/currentTurnierDetails');
        const gruppenData = await gruppenResponse.json();
        console.log('Gruppenrunden Details:', gruppenData);
        setGruppenDetails(gruppenData);

        // Fetch turnier details (groups with participants) for the active Turnier
        const detailsResponse = await fetch('http://localhost:5222/api/turnier/gruppenrundenDetails');
        const detailsData = await detailsResponse.json();
        console.log('Gruppenrunden Details:', detailsData);
        setgruppenrundenDetails(detailsData);
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

  // Create a map to group Teilnehmer based on group
  const groupedTeilnehmerByGroup = gruppenrundenDetails.reduce((acc, detail) => {
    if (!acc[detail.gruppenname]) {
      acc[detail.gruppenname] = [];
    }
    acc[detail.gruppenname].push(detail);
    return acc;
  }, {});


  //Submit scores
  // Inside your component function
const submitScores = async (teilnehmer1Id, teilnehmer2Id, score) => {
  try {
    const response = await fetch('http://localhost:5222/api/spielteilnehmer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Teilnehmer1Id: teilnehmer1Id,
        Teilnehmer2Id: teilnehmer2Id,
        Punkte: score,
        // Add any other required data
      }),
    });

    if (response.ok) {
      console.log('Scores submitted successfully');
      // You may want to update the local state after a successful submission
    } else {
      console.error('Failed to submit scores');
    }
  } catch (error) {
    console.error('Error submitting scores:', error);
  }
};

  return (
    <div>
      {activeTurnierFound ? (
        <>
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
                    <td className="cellWithSpace">{turnier.isActive ? 'Aktiv' : 'Inaktiv'}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Display groups and their associated Teilnehmer */}
          {gruppenDetails.map((group) => (
            <div key={group.gruppeId}>
              <h2>{group.gruppenname}</h2>

              {/* Check if teilnehmer is defined before mapping */}
              {group.teilnehmer && group.teilnehmer.length > 0 ? (
                <table>
                  <thead>
                    <tr>
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

          <br />

          {/* Display games for each group */}
          {Object.entries(groupedTeilnehmerByGroup).map(([groupName, groupTeilnehmer]) => (
            <div key={groupName}>
              <h2>Begegnungen {groupName} </h2>
              <table>
                <thead>
                  <tr>
                    <th className="cellWithSpace">Teilnehmer 1</th>
                    <th className="cellWithSpace">Teilnehmer 2</th>
                    <th className="cellWithSpace">Punkte 1</th>
                    <th className="cellWithSpace">Punkte 2</th>
                  </tr>
                </thead>
                <tbody>
                  {groupTeilnehmer.map((teilnehmer1, index) => (
                    // Iterate over Teilnehmer pairs
                    groupTeilnehmer.map((teilnehmer2, innerIndex) => {
                      // Check for duplicate pairs
                      if (innerIndex > index && teilnehmer1.spielId === teilnehmer2.spielId) {
                        return (
                          <tr key={index + '-' + innerIndex}>
                            <td className="cellWithSpace">{teilnehmer1.vorname}</td>
                            <td className="cellWithSpace">{teilnehmer2.vorname}</td>
                            <td className="cellWithSpace">{teilnehmer1.punkte !== null ? teilnehmer1.punkte : ''}</td>
                            <td className="cellWithSpace">{teilnehmer2.punkte !== null ? teilnehmer2.punkte : ''}</td>
                          </tr>
                        );
                      }
                      return null;
                    })
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      ) : (
        <p>No active Turnier found.</p>
      )}
    </div>
  );
}

export default Uebersicht;
