import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../Styles/EventLocation.css';
import TextArea from '../Components/TextArea';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { fetchText, saveText } from '../api/eventLocationApi';

const markerIconUrl = `${process.env.PUBLIC_URL}/images/markerO.png`;

const EventLocation = () => {
  const position: LatLngTuple = [50.0807608, 14.7195100];
  const zoom = 13;

  const customIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [25, 38],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const [text, setText] = useState<string>('');

  // Načtení textu z databáze
  useEffect(() => {
    const getText = async () => {
      try {
        const data = await fetchText();
        setText(data.content);
      } catch (error) {
        console.error('Chyba při načítání textu:', error);
      }
    };

    getText();
  }, []);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleSaveText = async (text: string) => {
    try {
      const token = sessionStorage.getItem('token');
      await saveText(text, token);
      console.log('Text byl úspěšně uložen!');
    } catch (error) {
      console.error('Chyba při ukládání textu:', error);
    }
  };

  return (
    <div className="event-location">
      <TextArea text={text} onTextChange={handleTextChange} onSave={handleSaveText} />
      
      <div className="map-container">
        <MapContainer center={position} zoom={zoom} className="leaflet-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <strong>Koupaliště Úvaly</strong> <br />
              Horova 1282 <br />
              Úvaly u Prahy
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default EventLocation;