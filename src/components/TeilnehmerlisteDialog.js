// TeilnehmerlisteDialog.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import "../styles/TeilnehmerlisteDialog.css";

const TeilnehmerlisteDialog = ({ open, onClose,teilnehmerList, turnier }) => {

  //array to contain all the selected/checked Teilnehmer
  const [selectedTeilnehmer, setSelectedTeilnehmer] = useState([]);
  const [teilnehmerDialogOpen, setTeilnehmerDialogOpen] = useState(false);

  //These are fields necessary for POST method to TurnierTeilnehmer enpoint
  const [teilnehmerId, setTeilnehmerId] = useState('');
  const [turnierId, setTurnierId] = useState('');

  useEffect(() => {
    setSelectedTeilnehmer([]); // Clear the selectedTeilnehmer when the dialog opens
  }, [open]);

  const handleTeilnehmerSelect = (teilnehmerId) => {
    // Toggle the selection of Teilnehmer
    setSelectedTeilnehmer((prevSelected) =>
      prevSelected.includes(teilnehmerId)
        ? prevSelected.filter((id) => id !== teilnehmerId)//// If teilnehmerId is already selected, remove it
        : [...prevSelected, teilnehmerId]//// If teilnehmerId is not selected, add it to the selected list
    );
  };

 
  const handleSave = async () => {
    try {
      //setTurnierId(turnier.id);
      setTurnierId(parseInt(turnier.id, 10));
      console.log(turnierId);
      //const turnierId = turnier.id;
      //const id=5;

      // Iterate through selectedTeilnehmer and make a POST request for each
      for (const teilnehmerId of selectedTeilnehmer) {
        const response = await fetch(`http://localhost:5222/api/turnierteilnehmer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            //turnierId,
            //teilnehmerIds: [teilnehmerId],
            turnierId: parseInt(turnier.id, 10),
            teilnehmerId:teilnehmerId,
          }),
        });

        if (!response.ok) {
          console.error(`Error updating TurnierTeilnehmer for Teilnehmer ID ${teilnehmerId}:`, response.statusText);
        }
        handleTeilnehmerListeClick();
      }

      // Close the dialog
      onClose();
    } catch (error) {
      console.error('Error updating TurnierTeilnehmer:', error);
    }
  };

  const handleTeilnehmerListeClick = (turnier) => {
    // Check if turnier is not null before setting the selectedTurnier
  if (turnier) {
    //setTurnierId(turnier.id);
    setTurnierId(parseInt(turnier.id, 10), () => {
      console.log(turnierId);
    });
    console.log("Turnier selected method hanldeTeilnehmerListeClick"+turnier);
    setTeilnehmerDialogOpen(true);
  } else {
    console.error('Error: Selected turnier is null.');
  }
  };

  return (
    <Modal className="teilnehmerListe-modal" isOpen={open} onRequestClose={onClose}>
      <div className="teilnehmerListe-content">
        <h2 className="ueberschrift-bearbeiten">Teilnehmerliste</h2>
        <ul>
          {teilnehmerList.map((teilnehmer) => (
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
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default TeilnehmerlisteDialog;
