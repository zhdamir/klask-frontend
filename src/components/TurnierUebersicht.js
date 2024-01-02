// Uebersicht.jsx

import React, { useState, useEffect } from 'react';
import TeilnehmerlisteDialog from './TeilnehmerlisteDialog';
import { useNavigate } from 'react-router-dom';

import "../TurnierUebersicht.css";

function TurnierUebersicht() {
  const [turnierList, setTurnierList] = useState([]);
  const [teilnehmerDialogOpen, setTeilnehmerDialogOpen] = useState(false);
  const [selectedTurnier, setSelectedTurnier] = useState(null);
  const [teilnehmerList, setTeilnehmerList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch Teilnehmer data
        const teilnehmerResponse = await fetch('http://localhost:5222/api/teilnehmer');
        const teilnehmerData = await teilnehmerResponse.json();
        setTeilnehmerList(teilnehmerData);

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

  const handleTeilnehmerListeClick = (turnier) => {
    // Check if turnier is not null before setting the selectedTurnier
  if (turnier) {
    setSelectedTurnier(turnier);
    //console.log("Turnier selected method hanldeTeilnehmerListeClick"+turnier);
    setTeilnehmerDialogOpen(true);
  } else {
    console.error('Error: Selected turnier is null.');
  }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  const handleStartClick = async (turnierId) => {
    try {
      const response = await fetch(`http://localhost:5222/api/turnier/startTurnier?turnierId=${turnierId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Handle success, e.g., redirect to Uebersicht page
       navigate("/TurnierUebersicht");
        console.log('Turnier started successfully');
      } else {
        // Handle error, e.g., show an error message
        console.error('Error starting turnier:', response.statusText);
      }
      navigate("/TurnierUebersicht");
    } catch (error) {
      // Handle exceptions appropriately
      console.error('Error starting turnier:', error.message);
    }
  };

  const handleVorrundeClick = async (turnierId) => {
    try {
      const response = await fetch(`http://localhost:5222/api/runde/startVorrunde?turnierId=${turnierId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Handle success, e.g., redirect to Uebersicht page
       navigate("/TurnierUebersicht");
        console.log('Vorrunde started successfully');
      } else {
        // Handle error, e.g., show an error message
        console.error('Error starting Vorrunde:', response.statusText);
      }
      navigate("/TurnierUebersicht");
    } catch (error) {
      // Handle exceptions appropriately
      console.error('Error starting Vorrunde:', error.message);
    }
  };

  const handleFinaleClick = async (turnierId) => {
    try {
      const response = await fetch(`http://localhost:5222/api/runde/startFinale?turnierId=${turnierId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Call handleJahrespunkteUpdate after the Finale has started successfully
      //await handleJahrespunkteUpdate(turnierId);

        // Handle success, e.g., redirect to Uebersicht page
       navigate("/TurnierUebersicht");
        console.log('Finale started successfully');
      } else {
        // Handle error, e.g., show an error message
        console.error('Error starting Finale:', response.statusText);
      }
      navigate("/TurnierUebersicht");
    } catch (error) {
      // Handle exceptions appropriately
      console.error('Error starting Finale:', error.message);
    }
  };

  const handleJahrespunkteUpdate = async (turnierId) => {
    try {
      const response = await fetch(`http://localhost:5222/api/jahrestabelleteilnehmer/updateJahresPunkte?turnierId=${turnierId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally, include a request body if required by your API
        body: JSON.stringify(/* your request payload */),
      });
  
      if (response.ok) {
        // Handle success, e.g., redirect to Uebersicht page
       // navigate("/TurnierUebersicht");
        console.log('Jahrespunkte updated successfully');
      } else {
        // Handle error, e.g., show an error message
        const errorText = await response.text(); // Read the error response
        console.error('Error updating Jahrespunkte:', errorText);
      }
    } catch (error) {
      // Handle exceptions appropriately
      console.error('Error updating Jahrespunkte:', error.message);
    }
  };
  


  

  
  return (
    <div className='turnier-flex-container'>
    <div className='turnierListe'>
      <h2>Turnierliste</h2>
      <table>
        <thead>
          <tr>
            <th >Turniertitel</th>
            <th>Startdatum</th>
            <th >Enddatum</th>
            <th >Anzahl Gruppen</th>
            <th >Status</th>
            <th >Teilnehmer Hinzufügen</th>
            <th >Start</th>
            <th >Vorrunde</th>
            <th >Finale</th>
          </tr>
        </thead>
        <tbody>
          {turnierList
            .sort((a, b) => a.id - b.id)
            .map((turnier) => (
              <tr key={turnier.id}>
                <td >{turnier.turnierTitel}</td>
                <td >{formatDate(turnier.startDatum)}</td>
                <td >{formatDate(turnier.endDatum)}</td>
                <td >{turnier.anzahlGruppen}</td>

                <td >{turnier.isActive? 'Aktiv':'Inaktiv'}</td>
                <td >
                  < button className="submitScore" onClick={() => handleTeilnehmerListeClick(turnier)}>Teilnehmer hinzufügen</button>
                </td>
                <td>
                  < button className="submitScore" onClick={()=>handleStartClick(turnier.id)}>Start</button>
                </td>
                <td>
                  < button className="submitScore" onClick={()=>handleVorrundeClick(turnier.id)}>Vorrunde</button>
                </td>
                <td>
                  < button className="submitScore" onClick={()=>handleFinaleClick(turnier.id)}>Finale</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {teilnehmerDialogOpen && (
        <TeilnehmerlisteDialog
          open={teilnehmerDialogOpen}
          onClose={() => setTeilnehmerDialogOpen(false)}
          teilnehmerList={teilnehmerList}
          turnier={selectedTurnier}
        />
      )}
    </div>
    </div>
  );
}

export default TurnierUebersicht;
