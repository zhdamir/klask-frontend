import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import "../TeilnehmerBearbeiten.css";

/*props als Parameter: open (boolean, ob das Modal geöffnet ist oder nicht), 
onClose (Funktion Modal schließen), teilnehmer (zu bearbeitender Teilnehmer), 
onUpdateTeilnehmer (func zum Aktualisieren der Teilnehmerdaten), 
bereichOptions (Optionen für Dropdown "Bereich") und rolleOptions (Optionen für das Dropdown "Rolle"). */
const TeilnehmerBearbeiten = ({ open, onClose, teilnehmer, onUpdateTeilnehmer, bereichOptions, rolleOptions }) => {
  
  /*die bearbeiteten Daten des Teilnehmers, die im Modal angezeigt werden. */
  const [editedTeilnehmer, setEditedTeilnehmer] = useState({});

  /*den Zustand "editedTeilnehmer" aktualisieren, wenn sich die teilnehmer prop ändert. 
  Er setzt den Ausgangszustand für den bearbeiteten Teilnehmer auf der Grundlage der über props empfangenen Daten. */
  useEffect(() => {
    setEditedTeilnehmer({
      vorname: teilnehmer?.vorname || '',
      nachname: teilnehmer?.nachname || '',
      email: teilnehmer?.email || '',
      bereichId: teilnehmer?.bereichId || '',
      rolleId: teilnehmer?.rolleId || '',
    });
  }, [teilnehmer]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5222/api/teilnehmer/${teilnehmer.teilnehmerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        /*
        body: JSON.stringify(editedTeilnehmer),*/
        body: JSON.stringify({
        teilnehmerId: teilnehmer.teilnehmerId, 
        ...editedTeilnehmer,
      }),
      });

      if (response.ok) {
        onUpdateTeilnehmer(teilnehmer.teilnehmerId, editedTeilnehmer);
        onClose();
      } else {
        console.error('Error updating Teilnehmer:', response.statusText);
        console.error('Error updating Teilnehmer:', await response.json());
      }
    } catch (error) {
      console.error('Error updating Teilnehmer:', error);
    }
  };

  return (
    <Modal className="bearbeiten-modal" isOpen={open} onRequestClose={onClose}>
      <div className="bearbeiten-content">
        <h2 className="ueberschrift-bearbeiten">Teilnehmer bearbeiten</h2>
       
          <label className="label1">Vorname:</label>
          <input className="input-box1" type="text" value={editedTeilnehmer.vorname} onChange={(e) => setEditedTeilnehmer({ ...editedTeilnehmer, vorname: e.target.value })} />
       
       
          <label className="label2">Nachname:</label>
          <input className="input-box2" type="text" value={editedTeilnehmer.nachname} onChange={(e) => setEditedTeilnehmer({ ...editedTeilnehmer, nachname: e.target.value })} />
        
       
        <label className="label3">Email:</label>
        <input className="input-box3" type="text" value={editedTeilnehmer.email} onChange={(e) => setEditedTeilnehmer({ ...editedTeilnehmer, email: e.target.value })} />
       
       
        <label className="label4">Bereich:</label>
        <select className="input-box4" value={editedTeilnehmer.bereichId} onChange={(e) => setEditedTeilnehmer({ ...editedTeilnehmer, bereichId: e.target.value })}>
          <option value="" disabled>Bereich wählen</option>
          {bereichOptions.map((bereich) => (
            <option key={bereich.bereichId} value={bereich.bereichId}>
              {bereich.bereichName}
            </option>
          ))}
        </select>
        
       
        <label className="label5">Rolle:</label>
        <select className="input-box5" value={editedTeilnehmer.rolleId} onChange={(e) => setEditedTeilnehmer({ ...editedTeilnehmer, rolleId: e.target.value })}>
          <option value="" disabled>Rolle wählen</option>
          {rolleOptions.map((rolle) => (
            <option key={rolle.rolleId} value={rolle.rolleId}>
              {rolle.bezeichnungRolle}
            </option>
          ))}
        </select>
        
       
          <button className="btn-speichern" onClick={handleSave}>Speichern</button>
          <button className="btn-abbrechen" onClick={onClose}>Abbrechen</button>
      </div>
          
    
    </Modal>
  );
};

export default TeilnehmerBearbeiten;
