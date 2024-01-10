import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../styles/Uebersicht.css';

function UebersichtHistorie() {
  // Extrahieren der turnierId aus den URL-Parametern
  const { turnierId } = useParams();

  // States für Turnierdetails, Gruppenrunden-Details, Gruppen-Details, 
  // Vorrunden-Details, Gruppen- und Vorrunden-Ergebnisse, Finale-Details, 
  // Details für das Spiel um den Dritten
  const [turnierDetails, setTurnierDetails] = useState(null);
  const [gruppenrundenDetails, setGruppenrundenDetails] = useState([]);
  const [gruppenDetails, setGruppenDetails] = useState([]);
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
        // Daten für das angegebene Turnier abrufen
        const turnierResponse = await fetch(`http://localhost:5222/api/turnier/${turnierId}`);
if (!turnierResponse.ok) {
  console.error(`Error fetching Turnier details. Status: ${turnierResponse.status}`);
  return;
}
const turnierData = await turnierResponse.json();
setTurnierDetails(turnierData);
console.log('Turnier Details:', turnierDetails);


        // Details zu dem Turnier abrufen
        const gruppenResponse = await fetch(`http://localhost:5222/api/turnier/selectedTurnierDetails/${turnierId}`);
        const gruppenData = await gruppenResponse.json();
        console.log('Gruppen Details:', gruppenData);
        setGruppenDetails(gruppenData);

        // Detaios zur Gruppenrunde abrufen
        const detailsResponse = await fetch(`http://localhost:5222/api/turnier/gruppenrundenDetailsHistorie/${turnierId}`);
        const detailsData = await detailsResponse.json();
        console.log('Gruppenrunden Details:', detailsData);
        setGruppenrundenDetails(detailsData);

        // Details zur Gruppenrunde Ergebnisse abrufen
        const gruppenResultsResponse = await fetch(`http://localhost:5222/api/turnier/gruppenrundenResultsHistorie/${turnierId}`);
        const resultsData = await gruppenResultsResponse.json();
        console.log('Gruppen Results:', resultsData);
        setGruppenResults(resultsData);

        // Details zur Vorrunde abrufen
        const vorrundenResponse = await fetch(`http://localhost:5222/api/runde/vorrundenDetailsHistorie/${turnierId}`);
        const vorrundenData = await vorrundenResponse.json();
        console.log('Gruppenrunden Details:', vorrundenData);
        setVorrundenDetails(vorrundenData);

        // Details zu den Vorrunde Ergebnissen abrufen
        const vorrundeResultsResponse = await fetch(`http://localhost:5222/api/runde/vorrundenResultsHistorie/${turnierId}`);
        const vorrundeResultsData = await vorrundeResultsResponse.json();
        console.log('Vorrunde Results:', vorrundeResultsData);
        setVorrundeResults(vorrundeResultsData);

        // Details zur finalen Runde abrufen
        const finaleResponse = await fetch(`http://localhost:5222/api/runde/finaleDetailsHistorie/${turnierId}`);
        const finaleData = await finaleResponse.json();
        console.log('Finale Details:', finaleData);
        setFinaleDetails(finaleData);
        

        // Details zum Spiel um den dritten Platz abrufen
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
                     
                      groupTeilnehmer.map((teilnehmer2, innerIndex) => {
                     
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
          


<div className='results-flex-container'>
  {gruppenDetails.map((group) => (
    <div className="resultsInhalt" key={group.gruppeId}>
      <h2>{" Ergebnisse "+ group.gruppenname}</h2>
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
              .sort((a, b) => b.satzDifferenz - a.satzDifferenz) 
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
   
    <>
      <h2>Vorrunden</h2>
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


<div className='vorrunde-flex-container'>
  <div className="vorrundeInhalt">
     
      <>
        <h2>Vorrunden</h2>
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
    
  </div>
</div>


<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  
    <>
      <h2>Finale</h2>
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


<div className='vorrunde-flex-container'>
    <div className="vorrundeInhalt">
  
    <>
      <h2>Spiel Um Dritten</h2>
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

        </>
     
  );
}

export default UebersichtHistorie;
