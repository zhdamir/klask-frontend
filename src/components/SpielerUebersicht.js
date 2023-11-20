import React, {useState, useEffect} from "react";


 function Uebersicht(){

    const[teilnehmerListe, setTeilnehmerListe]=useState([]);

    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const response = await fetch('http://localhost:5222/api/teilnehmer');
                const data = await response.json();
                setTeilnehmerListe(data);
            }catch(error){
                console.error("Fehler beim Datenholen!S");
            }
        };

        fetchData();
    },[]);

    return(
        <div>
      <h1>Das ist Übersicht</h1>
      <table>
        <thead>
          <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Email</th>
            <th>Bereich</th>
            <th>Rolle</th>
          </tr>
        </thead>
        <tbody>
          {teilnehmerListe.map((teilnehmer) => (
            <tr key={teilnehmer.teilnehmerId}>
              <td>{teilnehmer.vorname}</td>
              <td>{teilnehmer.nachname}</td>
              <td>{teilnehmer.email}</td>
              <td>{teilnehmer.bereich?.bereichName}</td>
              <td>{teilnehmer.rolle?.bezeichnungRolle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}


export default Uebersicht;