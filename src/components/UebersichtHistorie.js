import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../Uebersicht.css';

function UebersichtHistorie() {
  const { turnierId } = useParams();
    const [turnierDetails, setTurnierDetails] = useState(null);

  const [gruppenrundenDetails, setGruppenrundenDetails] = useState([]);
  const [gruppenDetails, setGruppenDetails] = useState([]);
  //const navigate = useNavigate();
  const [vorrundenDetails, setVorrundenDetails] = useState([]);


  const [gruppenResults, setGruppenResults] = useState([]);
  const [vorrundeResults, setVorrundeResults] = useState([]);
  const [finaleDetails, setFinaleDetails] = useState([]);
  const [spielUmDrittenDetails, setSpielUmDrittenDetails] = useState([]);

  
  useEffect(() => {
    console.log('turnierDetails changed:', turnierDetails);
  }, [turnierDetails]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all Turniere
        /*const turnierResponse = await fetch(`http://localhost:5222/api/turnier/${turnierId}`);
        const turnierData = await turnierResponse.json();
        
        // Set the  turnier
        setTurnierDetails(turnierData);
        console.log('Turnier Details:', turnierDetails);*/
        console.log('turnierId:', turnierId);
        const turnierResponse = await fetch(`http://localhost:5222/api/turnier/${turnierId}`);
if (!turnierResponse.ok) {
  console.error(`Error fetching Turnier details. Status: ${turnierResponse.status}`);
  return;
}
const turnierData = await turnierResponse.json();
// Set the  turnier
setTurnierDetails(turnierData);
console.log('Turnier Details:', turnierDetails);


        // Fetch turnier details (groups with participants) for the Turnier with turnierId
        const gruppenResponse = await fetch(`http://localhost:5222/api/turnier/selectedTurnierDetails/${turnierId}`);
        const gruppenData = await gruppenResponse.json();
        console.log('Gruppen Details:', gruppenData);
        setGruppenDetails(gruppenData);

        // Fetch turnier details (groups with participants) for the requested Turnier
        const detailsResponse = await fetch(`http://localhost:5222/api/turnier/gruppenrundenDetailsHistorie/${turnierId}`);
        const detailsData = await detailsResponse.json();
        console.log('Gruppenrunden Details:', detailsData);
        setGruppenrundenDetails(detailsData);

        // Fetch turnier details (groups with participants) for the active Turnier
        const gruppenResultsResponse = await fetch(`http://localhost:5222/api/turnier/gruppenrundenResultsHistorie/${turnierId}`);
        const resultsData = await gruppenResultsResponse.json();
        console.log('Gruppen Results:', resultsData);
        setGruppenResults(resultsData);

        // Fetch vorrunden details for the active Turnier
        const vorrundenResponse = await fetch(`http://localhost:5222/api/runde/vorrundenDetailsHistorie/${turnierId}`);
        const vorrundenData = await vorrundenResponse.json();
        console.log('Gruppenrunden Details:', vorrundenData);
        setVorrundenDetails(vorrundenData);

        // Fetch turnier details (groups with participants) for the active Turnier
        const vorrundeResultsResponse = await fetch(`http://localhost:5222/api/runde/vorrundenResultsHistorie/${turnierId}`);
        const vorrundeResultsData = await vorrundeResultsResponse.json();
        console.log('Vorrunde Results:', vorrundeResultsData);
        setVorrundeResults(vorrundeResultsData);

        // Fetch vorrunden details for the active Turnier
        const finaleResponse = await fetch(`http://localhost:5222/api/runde/finaleDetailsHistorie/${turnierId}`);
        const finaleData = await finaleResponse.json();
        console.log('Finale Details:', finaleData);
        setFinaleDetails(finaleData);

        

        // Fetch vorrunden details for the active Turnier
        const spielUmDritenResponse = await fetch(`http://localhost:5222/api/runde/spielUmDrittenDetailsHistorie/${turnierId}`);
        const spielUmDritenData = await spielUmDritenResponse.json();
        console.log('Finale Details:', spielUmDritenData);
        setSpielUmDrittenDetails(spielUmDritenData);

      
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



  return (
    
      
        <>
  {turnierDetails&& (
    <>
      <h2 className='heading'>Historie Turnier {turnierDetails.turnierTitel}</h2>
      <div className='activeTurnierDaten'>
        <div><h2>Turniertitel</h2> <div>{turnierDetails.turnierTitel}</div></div>
        <div><h2>Startdatum</h2><div>{formatDate(turnierDetails.startDatum)}</div></div>
        <div><h2>Enddatum</h2><div>{formatDate(turnierDetails.endDatum)}</div></div>
        <div><h2>Anzahl Gruppen</h2><div>{turnierDetails.anzahlGruppen}</div></div>
        <div><h2>Status</h2><div>{turnierDetails.isActive ? 'Aktiv' : 'Inaktiv'}</div></div>
      </div>
    </>
  )}   
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
                    {groupTeilnehmer
                     .sort((a, b) => a.vorname.localeCompare(b.vorname))
                     .map((teilnehmer1, index) => (
                      // Iterate over Teilnehmer pairs
                      groupTeilnehmer.map((teilnehmer2, innerIndex) => {
                        // Check for duplicate pairs
                        if (innerIndex > index && teilnehmer1.spielId === teilnehmer2.spielId) {
                          const spielTeilnehmerId1 = teilnehmer1.spielTeilnehmerId;
                          const spielTeilnehmerId2 = teilnehmer2.spielTeilnehmerId;

                          const rowKey = `${spielTeilnehmerId1}-${spielTeilnehmerId2}`;

                          return (
                            <tr /*key={index + '-' + innerIndex}*/key={rowKey}>
                              <td className="cellWithSpace">{teilnehmer1.vorname}</td>
                              <td className="cellWithSpace">{teilnehmer2.vorname}</td>
                              <td className="cellWithSpace">{teilnehmer1.punkte}</td>
                              <td className="cellWithSpace">{teilnehmer2.punkte}</td>
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
          

{/* Display groups and their associated Ergebnisse */}
<div className='results-flex-container'>
  {gruppenDetails.map((group) => (
    <div className="resultsInhalt" key={group.gruppeId}>
      <h2>{" Ergebnisse "+ group.gruppenname}</h2>
      {/* Check if gruppenResults for the current group is defined before mapping */}
      {gruppenResults && gruppenResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="cellWithSpace">Vorname</th>
              <th className="cellWithSpace">Anzahl Spiele</th>
              <th className="cellWithSpace">Anzahl Siege</th>
              <th className="cellWithSpace">Satz Diff</th>
              {/* Add other columns as needed */}
            </tr>
          </thead>
          <tbody>
            {gruppenResults
              .filter((result) => result.gruppeId === group.gruppeId)
              .sort((a, b) => b.satzDifferenz - a.satzDifferenz) // Sort by Sätze Diff in descending order
              .reduce((acc, result) => {
                // Initialize the accumulator if not done already
                if (!acc.teilnehmerIds) {
                  acc.teilnehmerIds = new Set();
                  acc.rows = [];
                }
              
                // Check if teilnehmerId is already in the Set
                if (!acc.teilnehmerIds.has(result.teilnehmerId)) {
                  // Add the teilnehmerId to the Set to mark it as processed
                  acc.teilnehmerIds.add(result.teilnehmerId);
              
                  // Render the row for this Teilnehmer
                  acc.rows.push(
                    <tr key={result.teilnehmerId}>
                      <td className="cellWithSpace">{result.vorname}</td>
                      <td className="cellWithSpace">{result.anzahlSpiele}</td>
                      <td className="cellWithSpace">{result.anzahlSiege}</td>
                      <td className="cellWithSpace">{result.satzDifferenz}</td>
                      {/* Add other cells for additional Ergebnisse information */}
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

{/* Display games for each group */}
<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
   
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

                

                const rowKey = `${spielTeilnehmerId1}-${spielTeilnehmerId2}`;

                return (
                  <tr key={rowKey}>
                    <td className="cellWithSpace">{teilnehmer1.vorname}</td>
                    <td className="cellWithSpace">{teilnehmer2.vorname}</td>
                    <td className="cellWithSpace">{teilnehmer1.punkte}</td>
                    <td className="cellWithSpace">{teilnehmer2.punkte}</td>
                  </tr>
                );
              }
              return null;
            })
          ))}
        </tbody>
      </table>
    </>
  
  </div>
</div>

{/* Display games for each group */}
<div className='vorrunde-flex-container'>
  <div className="vorrundeInhalt">
     
      <>
        <h2>Vorrunden</h2>
        <table>
          <thead>
            <tr>
              {/* Add headers for vorrundenDetails */}
              <th className="cellWithSpace">Vorname</th>
              <th className="cellWithSpace">Anzahl Spiele</th>
              <th className="cellWithSpace">Anzahl Siege</th>
              <th className="cellWithSpace">Sätze Differenz</th>
            </tr>
          </thead>
          <tbody>
            {vorrundeResults
              .sort((a, b) => b.satzDifferenz - a.satzDifferenz) // Sort by Sätze Diff in descending order
              .reduce((acc, result) => {
                // Check if teilnehmerId is already in the acc array
                if (!acc.some((item) => item.teilnehmerId === result.teilnehmerId)) {
                  // Add the result to the acc array
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
    
  </div>
</div>

{/* Display games for each group */}
<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  
    <>
      <h2>Finale</h2>
      <table>
        <thead>
          <tr>
            {/* Add headers for vorrundenDetails */}
            
            <th className="cellWithSpace">Teilnehmer 1</th>
            <th className="cellWithSpace">Teilnehmer 2</th>
            <th className="cellWithSpace">Punkte 1</th>
            <th className="cellWithSpace">Punkte 2</th>
            {/*<th className="cellWithSpace">Spiel</th> {/* New column for Platz */}
          </tr>
        </thead>
        <tbody>
          {finaleDetails.map((teilnehmer1, index) => (
            // Iterate over Teilnehmer pairs
            finaleDetails.map((teilnehmer2, innerIndex) => {
              // Check for duplicate pairs
              if (innerIndex > index && teilnehmer1.spielId === teilnehmer2.spielId) {
                const spielTeilnehmerId1 = teilnehmer1.spielTeilnehmerId;
                const spielTeilnehmerId2 = teilnehmer2.spielTeilnehmerId;



                const rowKey = `${spielTeilnehmerId1}-${spielTeilnehmerId2}`;
                // Determine Platz based on row index
                //const platz = index === 0 ? "Spiel um 1. Platz" : "Spiel um 3. Platz";

                return (
                  <tr key={rowKey}>
                    <td className="cellWithSpace">{teilnehmer1.vorname}</td>
                    <td className="cellWithSpace">{teilnehmer2.vorname}</td>
                    <td className="cellWithSpace">{teilnehmer1.punkte}</td>
                    <td className="cellWithSpace">{teilnehmer2.punkte}</td>
                    
                    {/*<td className="cellWithSpace">{platz}</td>*/}
                  </tr>
                );
              }
              return null;
            })
          ))}
        </tbody>
      </table>
    </>
  
  </div>
</div>

{/* Display games for each group */}
<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  
    <>
      <h2>Spiel Um Dritten</h2>
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
          {spielUmDrittenDetails.map((teilnehmer1, index) => (
            // Iterate over Teilnehmer pairs
            spielUmDrittenDetails.map((teilnehmer2, innerIndex) => {
              // Check for duplicate pairs
              if (innerIndex > index && teilnehmer1.spielId === teilnehmer2.spielId) {
                const spielTeilnehmerId1 = teilnehmer1.spielTeilnehmerId;
                const spielTeilnehmerId2 = teilnehmer2.spielTeilnehmerId;



                const rowKey = `${spielTeilnehmerId1}-${spielTeilnehmerId2}`;
                // Determine Platz based on row index
               // const platz = index === 0 ? "Spiel um 1. Platz" : "Spiel um 3. Platz";

                return (
                  <tr key={rowKey}>
                    <td className="cellWithSpace">{teilnehmer1.vorname}</td>
                    <td className="cellWithSpace">{teilnehmer2.vorname}</td>
                    <td className="cellWithSpace">{teilnehmer1.punkte}</td>
                    <td className="cellWithSpace">{teilnehmer2.punkte}</td>
                    
                   
                  </tr>
                );
              }
              return null;
            })
          ))}
        </tbody>
      </table>
    </>
  
  </div>
</div>




        </>
     
  );
}

export default UebersichtHistorie;
