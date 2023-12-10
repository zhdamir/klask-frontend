import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../Uebersicht.css';

function Uebersicht() {
  const [turnierList, setTurnierList] = useState([]);
  const [gruppenrundenDetails, setGruppenrundenDetails] = useState([]);
  const [gruppenDetails, setGruppenDetails] = useState([]);
  const [activeTurnierFound, setActiveTurnierFound] = useState(true);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();
  const [vorrundenDetails, setVorrundenDetails] = useState([]);
  const [vorrundeStarted, setVorrundeStarted] = useState(false);
  const [startScreenVisible, setStartScreenVisible] = useState(true); //

  const handleStartScreenClick = () => {
    // Hide the start screen and enable body overflow
    setStartScreenVisible(false);
    document.querySelector('body').style.overflowY = 'auto';
  };

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
        console.log('Gruppen Details:', gruppenData);
        setGruppenDetails(gruppenData);

        // Fetch turnier details (groups with participants) for the active Turnier
        const detailsResponse = await fetch('http://localhost:5222/api/turnier/gruppenrundenDetails');
        const detailsData = await detailsResponse.json();
        console.log('Gruppenrunden Details:', detailsData);
        setGruppenrundenDetails(detailsData);

        // Fetch vorrunden details for the active Turnier
        const vorrundenResponse = await fetch('http://localhost:5222/api/runde/vorrundenDetails');
        const vorrundenData = await vorrundenResponse.json();
        console.log('Gruppenrunden Details:', vorrundenData);
        setVorrundenDetails(vorrundenData);
        // Check if Vorrunde has started
    setVorrundeStarted(vorrundenData.length > 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [scores]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  const handleUpdatePunkte = async (spieleTeilnehmerId, neuePunkte) => {
    try {
      const response = await fetch(`http://localhost:5222/api/spielteilnehmer/updatePunkte/${spieleTeilnehmerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(neuePunkte),
      });

      if (response.ok) {
        // Handle success, e.g., redirect to Uebersicht page
        navigate('/Uebersicht');
        console.log('Punkte updated successfully');
      } else {
        // Handle error, e.g., show an error message
        console.error('Error updating punkte:', response.statusText);
      }
    } catch (error) {
      // Handle exceptions appropriately
      console.error('Error updating punkte:', error.message);
    }
  };

  const handleSubmitScores = async () => {
    try {
      // Loop through the scores and submit each score
      for (const [spielTeilnehmerId, score] of Object.entries(scores)) {
        console.log('Scores to submit:', scores);

        // Convert score to an integer before sending
        const parsedScore = parseInt(score, 10);

        // Call the update punkte function
        await handleUpdatePunkte(spielTeilnehmerId, parsedScore);
      }
      // Optional: Reset scores after submission
      setScores({});
      console.log('Scores submitted successfully');
    } catch (error) {
      console.error('Error submitting scores:', error);
    }
  };

  // Create a map to group Teilnehmer based on group
  const groupedTeilnehmerByGroup = gruppenrundenDetails.reduce((acc, detail) => {
    if (!acc[detail.gruppenname]) {
      acc[detail.gruppenname] = [];
    }
    acc[detail.gruppenname].push(detail);
    return acc;
  }, {});

  const handleScoreChange = (spielTeilnehmerId, value) => {
    setScores({
      ...scores,
      [spielTeilnehmerId]: value,
    });
  };

  return (
    <div>
       {startScreenVisible && (
       <div className="start-screen" onClick={handleStartScreenClick}>
        <div className="left">
            <div className="klask-logo">
                <img src="/klask_logo.svg" alt="klask" height="400"/>
            </div>
        </div>
        <div className="right">
            <div className="klask-logo">
                <img src="/klask_logo.svg" alt="klask" height="400"/>
            </div>
        </div>
    </div>)}
      {activeTurnierFound ? (
        <>
       
         
          {turnierList
  .sort((a, b) => a.id - b.id)
  .map((turnier) => (
    <>
    <h2 className='heading'>Aktuelles Turnier</h2>
    <div className='activeTurnierDaten'>
      <div><h2>Turniertitel</h2> <div>{turnier.turnierTitel}</div></div>
      <div><h2>Startdatum</h2><div>{formatDate(turnier.startDatum)}</div></div>
      <div><h2>Enddatum</h2><div>{formatDate(turnier.endDatum)}</div></div>
      <div><h2>Anzahl Gruppen</h2><div>{turnier.anzahlGruppen}</div></div>
      <div><h2>Status</h2><div>{turnier.isActive ? 'Aktiv' : 'Inaktiv'}</div></div>
    </div>
    </>
))}
          {/*<table>
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
                </table>*/}

          {/* Display groups and their associated Teilnehmer */}
          <div className='gruppe-flex-container'>
          {gruppenDetails.map((group) => (
            <>
                <div className="gruppe-inhalt" key={group.gruppeId}>
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
            </>
          ))}
        </div>
          <br />

          {/* Display games for each group */}
          <div className='gruppenSpiele-flex-container'>
            {Object.entries(groupedTeilnehmerByGroup).map(([groupName, groupTeilnehmer]) => (
              <div className="gruppeSpieleInhalt" key={groupName}>
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
                          const spielTeilnehmerId1 = teilnehmer1.spielTeilnehmerId;
                          const spielTeilnehmerId2 = teilnehmer2.spielTeilnehmerId;

                          const score1 = scores[spielTeilnehmerId1] || teilnehmer1.punkte; // Use default score if not in scores
                          const score2 = scores[spielTeilnehmerId2] || teilnehmer2.punkte; // Use default score if not in scores

                          const rowKey = `${spielTeilnehmerId1}-${spielTeilnehmerId2}`;

                          return (
                            <tr /*key={index + '-' + innerIndex}*/key={rowKey}>
                              <td className="cellWithSpace">{teilnehmer1.vorname}</td>
                              <td className="cellWithSpace">{teilnehmer2.vorname}</td>
                              <td className="cellWithSpace">
                                <select
                                value={score1 === null ? "" : score1}
                                  onChange={(e) => handleScoreChange(spielTeilnehmerId1, e.target.value)}
                                >
                                  <option value="" disabled>
                                    Select Score
                                  </option>
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                </select>
                              </td>
                              <td className="cellWithSpace">
                                <select
                                  value={score2 === null ? "" : score2}
                                  onChange={(e) => handleScoreChange(spielTeilnehmerId2, e.target.value)}
                                >
                                  <option value="" disabled>
                                    Select Score
                                  </option>
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                </select>
                              </td>
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
</div>
          


{/* Display games for each group */}
<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  {vorrundeStarted && (
    <>
      <h2>Vorrunden</h2>
      <table>
        <thead>
          <tr>
            {/* Add headers for vorrundenDetails */}
            <th className="cellWithSpace">Teilnehmer 1</th>
            <th className="cellWithSpace">Teilnehmer 2</th>
            <th className="cellWithSpace">Punkte 1</th>
            <th className="cellWithSpace">Punkte 2</th>
          </tr>
        </thead>
        <tbody>
          {vorrundenDetails.map((teilnehmer1, index) => (
            // Iterate over Teilnehmer pairs
            vorrundenDetails.map((teilnehmer2, innerIndex) => {
              // Check for duplicate pairs
              if (innerIndex > index && teilnehmer1.spielId === teilnehmer2.spielId) {
                const spielTeilnehmerId1 = teilnehmer1.spielTeilnehmerId;
                const spielTeilnehmerId2 = teilnehmer2.spielTeilnehmerId;

                const score1 = scores[spielTeilnehmerId1] || teilnehmer1.punkte;
                const score2 = scores[spielTeilnehmerId2] || teilnehmer2.punkte;

                const rowKey = `${spielTeilnehmerId1}-${spielTeilnehmerId2}`;

                return (
                  <tr key={rowKey}>
                    <td className="cellWithSpace">{teilnehmer1.vorname}</td>
                    <td className="cellWithSpace">{teilnehmer2.vorname}</td>
                    <td className="cellWithSpace">
                      <select
                        value={score1 === null ? "" : score1}
                        onChange={(e) => handleScoreChange(spielTeilnehmerId1, e.target.value)}
                      >
                        <option value="" disabled>
                          Select Score
                        </option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </td>
                    <td className="cellWithSpace">
                      <select
                        value={score2 === null ? "" : score2}
                        onChange={(e) => handleScoreChange(spielTeilnehmerId2, e.target.value)}
                      >
                        <option value="" disabled>
                          Select Score
                        </option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </td>
                  </tr>
                );
              }
              return null;
            })
          ))}
        </tbody>
      </table>
    </>
  )}
  </div>
</div>

{/* Button to submit scores */}
<button className="submitScore" onClick={handleSubmitScores}>Submit Scores</button>
        </>
      ) : (
        <p>No active Turnier found.</p>
      )}
    </div>
  );
}

export default Uebersicht;
