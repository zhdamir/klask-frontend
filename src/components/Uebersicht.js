import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/Uebersicht.css';

function Uebersicht() {
  // States für die Liste der Turniere, Gruppenrunden-Details, Gruppen-Details, 
  // Status des aktiven Turniers, Punkte, Navigation, Vorrunden-Details, 
  // Vorrunde gestartet, Sichtbarkeit des Startbildschirms, Gruppen- und Vorrunden-Ergebnisse, 
  // Finale gestartet, Finale-Details und Details für das Spiel um den Dritten
 
  const [turnierList, setTurnierList] = useState([]);
  const [gruppenrundenDetails, setGruppenrundenDetails] = useState([]);
  const [gruppenDetails, setGruppenDetails] = useState([]);
  const [activeTurnierFound, setActiveTurnierFound] = useState(true);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();
  const [vorrundenDetails, setVorrundenDetails] = useState([]);
  const [vorrundeStarted, setVorrundeStarted] = useState(false);


  const [gruppenResults, setGruppenResults] = useState([]);
  const [vorrundeResults, setVorrundeResults] = useState([]);

  const [finaleStarted, setFinaleStarted] = useState(false);
  const [finaleDetails, setFinaleDetails] = useState([]);

  const [spielUmDrittenDetails, setSpielUmDrittenDetails] = useState([]);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // alle Turniereholen
        const turnierResponse = await fetch('http://localhost:5222/api/turnier');
        const turnierData = await turnierResponse.json();

        // aktives  Turnier finden
        const activeTurnierList = turnierData.filter((turnier) => turnier.isActive);

        if (activeTurnierList.length === 0) {
          console.error('No active Turnier found.');
          setActiveTurnierFound(false);
          return;
        }

        
        setTurnierList(activeTurnierList);

        // Details zu den Gruppen abrufen
        const gruppenResponse = await fetch('http://localhost:5222/api/turnier/currentTurnierDetails');
        const gruppenData = await gruppenResponse.json();
        console.log('Gruppen Details:', gruppenData);
        setGruppenDetails(gruppenData);

        // Turnierdetails zu der Gruppenvorrunde abrufen
        const detailsResponse = await fetch('http://localhost:5222/api/turnier/gruppenrundenDetails');
        const detailsData = await detailsResponse.json();
        console.log('Gruppenrunden Details:', detailsData);
        setGruppenrundenDetails(detailsData);

       // Turnierdetails zu den Gruppenrunden Ergebnissen abrufen
       const gruppenResultsResponse = await fetch('http://localhost:5222/api/turnier/gruppenrundenResults');
        const resultsData = await gruppenResultsResponse.json();
        console.log('Gruppen Results:', resultsData);
        setGruppenResults(resultsData);

        //Details zur Vorrunde abrufen
        const vorrundenResponse = await fetch('http://localhost:5222/api/runde/vorrundenDetails');
        const vorrundenData = await vorrundenResponse.json();
        console.log('Gruppenrunden Details:', vorrundenData);
        setVorrundenDetails(vorrundenData);

        // Details zu den Vorrundenergebnissen abrufen
        const vorrundeResultsResponse = await fetch('http://localhost:5222/api/runde/vorrundenResults');
        const vorrundeResultsData = await vorrundeResultsResponse.json();
        console.log('Vorrunde Results:', vorrundeResultsData);
        setVorrundeResults(vorrundeResultsData);

        // Details zu der finalen Runde abrufen
        const finaleResponse = await fetch('http://localhost:5222/api/runde/finaleDetails');
        const finaleData = await finaleResponse.json();
        console.log('Finale Details:', finaleData);
        setFinaleDetails(finaleData);

        // Deatils zu dem Spiel um den dritten Platz abrufen
        const spielUmDritenResponse = await fetch('http://localhost:5222/api/runde/spielUmDrittenDetails');
        const spielUmDrittenData = await spielUmDritenResponse.json();
        console.log('Spiel Um Dritten Details:', spielUmDrittenData);
        setSpielUmDrittenDetails(spielUmDrittenData);


       // Überprüfen, ob die Vorrunde gestartet wurde
    setVorrundeStarted(vorrundenData.length > 0);
    setFinaleStarted(finaleData.length > 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [scores]);

  // Funktion zum Formatieren des Datums
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  // Funktion zum Aktualisieren der Punkte in der Datenbank
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
        navigate('/Uebersicht');
        console.log('Punkte updated successfully');
      } else {
        console.error('Error updating punkte:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating punkte:', error.message);
    }
  };

  // Funktion zum Spiechern der Punkte
  const handleSubmitScores = async () => {
    try {
      //die Punkte und sende jeden Punktestand durchlaufen
      for (const [spielTeilnehmerId, score] of Object.entries(scores)) {
        console.log('Scores to submit:', scores);

         // Konvertiere Punkte vor dem Senden in eine Ganzzahl
        const parsedScore = parseInt(score, 10);

        // Rufe die Funktion zum Aktualisieren der Punkte auf
        await handleUpdatePunkte(spielTeilnehmerId, parsedScore);
      }
      
      setScores({});
      console.log('Scores submitted successfully');
    } catch (error) {
      console.error('Error submitting scores:', error);
    }
  };

  // Erstelle eine Map, um Teilnehmer nach Gruppe zu gruppieren
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


 // JSX für die Komponente
  return (
    <div>
       
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
          {/*Gruppen und Teilnehmer anzeigen */}
          <div className='gruppe-flex-container'>
          {gruppenDetails.map((group) => (
            <>
                <div className="gruppe-inhalt" key={group.gruppeId}>
                  <h2>{group.gruppenname}</h2>
                  {group.teilnehmer && group.teilnehmer.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {group.teilnehmer.map((teilnehmer) => (
                          <tr key={teilnehmer.teilnehmerId}>
                            <td className="cellWithSpace">{teilnehmer.vorname}</td>
                          
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

          {/* Spiele für jede Gruppe anzeigen*/}
          <div className='gruppenSpiele-flex-container'>
            {Object.entries(groupedTeilnehmerByGroup).map(([groupName, groupTeilnehmer]) => (
              <div className="gruppeSpieleInhalt" key={groupName}>
                <h2 className="headerTable">Begegnungen {groupName} </h2>
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
                    {groupTeilnehmer
                     .sort((a, b) => a.vorname.localeCompare(b.vorname))
                     .map((teilnehmer1, index) => (
                      
                      groupTeilnehmer.map((teilnehmer2, innerIndex) => {
                      
                        if (innerIndex > index && teilnehmer1.spielId === teilnehmer2.spielId) {
                          const spielTeilnehmerId1 = teilnehmer1.spielTeilnehmerId;
                          const spielTeilnehmerId2 = teilnehmer2.spielTeilnehmerId;

                          const score1 = scores[spielTeilnehmerId1] || teilnehmer1.punkte; 
                          const score2 = scores[spielTeilnehmerId2] || teilnehmer2.punkte; 

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
          

{/*Gruppenergebnisse anzeigen */}
<div className='results-flex-container'>
  {gruppenDetails.map((group) => (
    <div className="resultsInhalt" key={group.gruppeId}>
      <h2 className="headerTable">{" Ergebnisse "+ group.gruppenname}</h2>
      {gruppenResults && gruppenResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="cellWithSpace">Vorname</th>
              <th className="cellWithSpace">Anzahl Spiele</th>
              <th className="cellWithSpace">Anzahl Siege</th>
              <th className="cellWithSpace">Satz Diff</th>
            </tr>
          </thead>
          <tbody>
            {gruppenResults
              .filter((result) => result.gruppeId === group.gruppeId)
              .sort((a, b) => b.satzDifferenz - a.satzDifferenz) // Nach Sätze Diff sortieren absteigend
              .reduce((acc, result) => {
                if (!acc.teilnehmerIds) {
                  acc.teilnehmerIds = new Set();
                  acc.rows = [];
                }
              
                if (!acc.teilnehmerIds.has(result.teilnehmerId)) {
                  acc.teilnehmerIds.add(result.teilnehmerId);
              
                  
                  acc.rows.push(
                    <tr key={result.teilnehmerId}>
                      <td className="cellWithSpace">{result.vorname}</td>
                      <td className="cellWithSpace">{result.anzahlSpiele}</td>
                      <td className="cellWithSpace">{result.anzahlSiege}</td>
                      <td className="cellWithSpace">{result.satzDifferenz}</td>
                     
                    </tr>
                  );
                }
              
                return acc;
              }, { teilnehmerIds: new Set(), rows: [] }).rows}
          </tbody>
        </table>
      )}
    </div>
  ))}
</div>

<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  {vorrundeStarted && (
    <>
      <h2 className="headerTable">Vorrunden</h2>
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
          {vorrundenDetails.map((teilnehmer1, index) => (
        
            vorrundenDetails.map((teilnehmer2, innerIndex) => {
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


<div className='vorrunde-flex-container'>
  <div className="vorrundeInhalt">
    {vorrundeStarted && (
      <>
        <h2 className="headerTable">Vorrunden Ergebnisse</h2>
        <table>
          <thead>
            <tr>
            
              <th className="cellWithSpace">Vorname</th>
              <th className="cellWithSpace">Anzahl Spiele</th>
              <th className="cellWithSpace">Anzahl Siege</th>
              <th className="cellWithSpace">Sätze Differenz</th>
            </tr>
          </thead>
          <tbody>
            {vorrundeResults
              .sort((a, b) => b.satzDifferenz - a.satzDifferenz) 
              .reduce((acc, result) => {
                
                if (!acc.some((item) => item.teilnehmerId === result.teilnehmerId)) {
                 
                  return [
                    ...acc,
                    {
                      teilnehmerId: result.teilnehmerId,
                      vorname: result.vorname,
                      anzahlSpiele: result.anzahlSpiele,
                      anzahlSiege: result.anzahlSiege,
                      satzDifferenz: result.satzDifferenz,
                    },
                  ];
                }
                return acc;
              }, [])
              .map((result) => (
                <tr key={result.teilnehmerId}>
                  <td className="cellWithSpace">{result.vorname}</td>
                  <td className="cellWithSpace">{result.anzahlSpiele}</td>
                  <td className="cellWithSpace">{result.anzahlSiege}</td>
                  <td className="cellWithSpace">{result.satzDifferenz}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    )}
  </div>
</div>


<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  {finaleStarted && (
    <>
      <h2 className='headerTable'>Finale</h2>
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
          {finaleDetails.map((teilnehmer1, index) => (
        
            finaleDetails.map((teilnehmer2, innerIndex) => {
           
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

<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  {finaleStarted && (
    <>
      <h2 className='headerTable'>Spiel um Dritten</h2>
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
          {spielUmDrittenDetails.map((teilnehmer1, index) => (
           
            spielUmDrittenDetails.map((teilnehmer2, innerIndex) => {
            
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


<button className="submitScore" onClick={handleSubmitScores}>Submit Scores</button>
        </>
      ) : (
        <p>No active Turnier found.</p>
      )}
    </div>
  );
}

export default Uebersicht;