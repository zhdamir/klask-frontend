// TeilnehmerlisteDialog.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import "../styles/TeilnehmerlisteDialog.css";

/*
  Props als Parameter:
  - open (boolean, ob das Modal geöffnet ist oder nicht)
  - onClose (Funktion zum Schließen des Modals)
  - teilnehmerList (Array der Teilnehmer für das aktuelle Turnier)
  - turnier (ausgewähltes Turnier)
*/
const TeilnehmerlisteDialog = ({ open, onClose,teilnehmerList, turnier }) => {

  // Array zum Speichern aller ausgewählten/ausgecheckten Teilnehmer
  const [selectedTeilnehmer, setSelectedTeilnehmer] = useState([]);
  const [teilnehmerDialogOpen, setTeilnehmerDialogOpen] = useState(false);

  // Felder für die POST-Methode zum TurnierTeilnehmer-Endpunkt
  const [teilnehmerId, setTeilnehmerId] = useState('');
  const [turnierId, setTurnierId] = useState('');

  useEffect(() => {
    setSelectedTeilnehmer([]); // Die ausgewählten Teilnehmer löschen, wenn das Dialogfeld geöffnet wird
  }, [open]);

  // Funktion zum Auswählen/Abwählen von Teilnehmern
  const handleTeilnehmerSelect = (teilnehmerId) => {
    // Die Auswahl des Teilnehmers umschalten
    setSelectedTeilnehmer((prevSelected) =>
      prevSelected.includes(teilnehmerId)
        ? prevSelected.filter((id) => id !== teilnehmerId)//// If teilnehmerId is already selected, remove it
        : [...prevSelected, teilnehmerId]//// If teilnehmerId is not selected, add it to the selected list
    );
  };

 // Funktion zum Speichern der ausgewählten Teilnehmer für das Turnier
  const handleSave = async () => {
    try {
      
      setTurnierId(parseInt(turnier.id, 10));
      console.log(turnierId);

      // Die ausgewählten Teilnehmer durchlaufen und für jeden eine POST-Anfrage machen
      for (const teilnehmerId of selectedTeilnehmer) {
        const response = await fetch(`http://localhost:5222/api/turnierteilnehmer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            turnierId: parseInt(turnier.id, 10),
            teilnehmerId:teilnehmerId,
          }),
        });

        if (!response.ok) {
          console.error(`Error updating TurnierTeilnehmer for Teilnehmer ID ${teilnehmerId}:`, response.statusText);
        }
        handleTeilnehmerListeClick();
      }

      // Schließe das Dialogfeld
      onClose();
    } catch (error) {
      console.error('Error updating TurnierTeilnehmer:', error);
    }
  };

  // Funktion zum Behandeln des Klicks auf den Teilnehmerliste-Button
  const handleTeilnehmerListeClick = (turnier) => {
    // Überprüfen, ob turnier nicht null ist, bevor selectedTurnier gesetzt wird
  if (turnier) {
    setTurnierId(parseInt(turnier.id, 10), () => {
      console.log(turnierId);
    });
    console.log("Turnier selected method hanldeTeilnehmerListeClick"+turnier);
    setTeilnehmerDialogOpen(true);
  } else {
    console.error('Error: Selected turnier is null.');
  }
  };

  // JSX für die Komponente
  return (
    <Modal className="teilnehmerListe-modal" isOpen={open} onRequestClose={onClose}>
      <div className="teilnehmerListe-content">

        <div className='dialog-content'>
          <div className='heading1'>
            <div className='heading2'>
              <h2 className="ueberschrift-bearbeiten-dlg">Teilnehmerliste</h2>
            </div>
          </div>
        <ul>
          {teilnehmerList .sort((a, b) => a.vorname.localeCompare(b.vorname)).map((teilnehmer) => (
            <li key={teilnehmer.teilnehmerId}>
              <input
                type="checkbox"
                checked={selectedTeilnehmer.includes(teilnehmer.teilnehmerId)}
                onChange={() => handleTeilnehmerSelect(teilnehmer.teilnehmerId)}
              />
              {`${teilnehmer.vorname} ${teilnehmer.nachname}`}
            </li>
          ))}
        </ul>
       
      </div>
      </div>

      <div className='btn-container'>
        <button className='btn-speichern' onClick={handleSave}>Speichern</button>
        <button className='btn-abbrechen' onClick={onClose}>Abbrechen</button>
        </div>
    </Modal>
  );
};

export default TeilnehmerlisteDialog;
