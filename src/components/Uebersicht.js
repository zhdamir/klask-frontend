// Uebersicht.jsx

import React, { useState, useEffect } from 'react';
import "../Uebersicht.css";

function Uebersicht() {
    const [turnierList, setTurnierList] = useState([]);
    const [groupsData, setGroupsData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch all Turniere
          const turnierResponse = await fetch('http://localhost:5222/api/turnier');
          const turnierData = await turnierResponse.json();
    
          // Find the active Turnier
          const activeTurnier = turnierData.find((turnier) => turnier.isActive);
    
          if (!activeTurnier) {
            console.error('No active Turnier found.');
            return;
          }
    
          // Fetch groups for the active Turnier
          const groupsResponse = await fetch(`http://localhost:5222/api/gruppe`);
          const groups = await groupsResponse.json();
          const groupsActive=groups.filter((gruppe)=>gruppe.turnierId===activeTurnier.id);
    
          // Fetch TurnierTeilnehmer for the active Turnier
        const turnierTeilnehmerResponse = await fetch(`http://localhost:5222/api/turnierteilnehmer`);
        const turnierTeilnehmerData = await turnierTeilnehmerResponse.json();
        const turnierTeilnehmerActive=turnierTeilnehmerData.filter((turnierTeilnehmer)=>turnierTeilnehmer.turnierId===activeTurnier.id);
    
          // Fetch Teilnehmer details using teilnehmerId from turnierTeilnehmerActive
        const teilnehmerDetails = await Promise.all(
          turnierTeilnehmerActive.map(async (turnierTeilnehmer) => {
            try {
              // Fetch Teilnehmer details using teilnehmerId
              const teilnehmerResponse = await fetch(`http://localhost:5222/api/teilnehmer/${turnierTeilnehmer.teilnehmerId}`);
              const teilnehmerDetail = await teilnehmerResponse.json();

              return { ...turnierTeilnehmer, teilnehmer: teilnehmerDetail };
            } catch (error) {
              console.error(`Error fetching Teilnehmer details for teilnehmerId ${turnierTeilnehmer.teilnehmerId}:`, error);
              return { ...turnierTeilnehmer, teilnehmer: null }; // Handle the error as needed
            }
          })
        );
    
          // Organize the data to associate each group with its Teilnehmer details
          const organizedData = groupsActive.map((group) => {
            const groupTeilnehmer = teilnehmerDetails.filter((te) => te.gruppeId === group.gruppeId);
            return { ...group, teilnehmer: groupTeilnehmer };
          });
    
          setGroupsData(organizedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, []);

    
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
      <br></br>
      {/* Display groups and their associated Teilnehmer */}
      {groupsData.map((group) => (
        <div key={group.gruppeId}>
          <h2>{group.groupName}</h2>

          {/* Display Teilnehmer for the current group */}
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
                  <td className="cellWithSpace">{teilnehmer.teilnehmerName}</td>
                  {/* Add other cells for additional Teilnehmer information */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Uebersicht;
