import React, { useState } from 'react';
import axios from 'axios';

export default function TurnierCaller() {
    const [turnierId, setTurnierId] = useState('');
    const [tournament, setTournament] = useState(null);
    const [newTurnierData, setNewTurnierData]=useState({
        TurnierTitel:'',
        StartDatum:'',
        EndDatum:'',
        AnzahlGruppen:0
    });

    const fetchTurnier = async () => {
        try {
            const response = await axios.get(`http://localhost:5222/api/turnier/${turnierId}`);
            if (response.status === 200) {
                setTournament(response.data);
            } else {
                throw new Error('Failed to fetch tournament.');
            }
        } catch (error) {
            console.error('Error fetching tournament:', error);
        }
    };

    //Turnier anlegen
    const createTurnier=async()=>{
        try{
            const response=await axios.post(`http://localhost:5222/api/turnier`, newTurnierData);
            if(response.status===201){
                fetchTurnier();
            }else{
                throw new Error('Failed to create the tournament.');
            }
        }catch(error){
            console.error("Error createing the tournament: ", error);
        }
    };

    return (
        <div>
            <h2>Fetch Tournament by ID</h2>
            <input
                type="text"
                placeholder="Enter Turnier ID"
                value={turnierId}
                onChange={(e) => setTurnierId(e.target.value)}
            />
            <button onClick={fetchTurnier}>Fetch Tournament</button>
            {tournament && (
                <div>
                    <h3>Tournament Details</h3>
                    <pre>{JSON.stringify(tournament, null, 2)}</pre>
                </div>
            )}
            
            <h2>Create a New Tournament</h2>
            <input
                type="text"
                placeholder="Turnier Title"
                value={newTurnierData.TurnierTitel}
                onChange={(e) => setNewTurnierData({ ...newTurnierData, TurnierTitel: e.target.value })}
            />
            <input
                type="date"
                placeholder="Start Date"
                value={newTurnierData.StartDatum}
                onChange={(e) => setNewTurnierData({ ...newTurnierData, StartDatum: e.target.value })}
            />
            <input
                type="date"
                placeholder="End Date"
                value={newTurnierData.EndDatum}
                onChange={(e) => setNewTurnierData({ ...newTurnierData, EndDatum: e.target.value })}
            />
             <input
                type="text"
                placeholder="End Date"
                value={newTurnierData.AnzahlGruppen}
                onChange={(e) => setNewTurnierData({ ...newTurnierData, AnzahlGruppen: e.target.value })}
            />
            <button onClick={createTurnier}>Create Tournament</button>
            {tournament && (
                <div>
                    <h3>Tournament Details</h3>
                    <pre>{JSON.stringify(tournament, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
