import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';
import '../Styles/Program.css';

const Program = () => {
  const [images, setImages] = useState<{ url: string, contentType: string, id: string }[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Načtení obrázků z databáze
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/program/images');
        setImages(response.data);
      } catch (error) {
        console.error('Chyba při načítání obrázků:', error);
      }
    };

    fetchImages();
  }, []);

  // Změna souboru v inputu
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImage(e.target.files[0]);
    } else {
      console.error('Chyba při načítání souboru: žádný soubor nebyl vybrán');
    }
  };

  // Nahrání souboru na server
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newImage) return;

    const formData = new FormData();
    formData.append('image', newImage); // Klíč musí být `image`, protože to očekává backend

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('/api/program/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const newImageUrl = `data:${response.data.contentType};base64,${response.data.image}`;
      setImages((prev) => [...prev, { url: newImageUrl, contentType: response.data.contentType, id: response.data.id }]);
    } catch (error) {
      console.error('Chyba při nahrávání obrázku:', error);
    }
  };

  // Smazání obrázku
  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`/api/program/images/${id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      // Aktualizace stavu po smazání obrázku
      setImages((prev) => prev.filter((image) => image.id !== id));
    } catch (error) {
      console.error('Chyba při mazání obrázku:', error);
    }
  };

  return (
    <div className="program-container">
      <h1>Program</h1>
      {isAuthenticated() && (
        <div className="upload-section">
          <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileChange} />
            <button className="btn btn-primary" type="submit">
              Nahrát obrázek
            </button>
          </form>
        </div>
      )}
      <div className="image-list">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image.url} alt={`Obrázek ${index + 1}`} className="image-thumbnail" />
            {isAuthenticated() && (
              <button
                onClick={() => handleDelete(image.id)}
                className="btn btn-danger btn-sm ml-2"
              >
                Smazat
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Program;