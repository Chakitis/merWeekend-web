import React, { useState, useEffect } from 'react';
import '../Styles/Program.css';
import { deleteImage, fetchImages, uploadImage } from '../api/programApi';

const Program = () => {
  const [images, setImages] = useState<{ url: string, contentType: string, id: string }[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Načtení obrázků z databáze
  useEffect(() => {
    const getImages = async () => {
      try {
        const data = await fetchImages();
        setImages(data);
      } catch (error) {
        console.error('Chyba při načítání obrázků:', error);
      }
    };

    getImages();
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

    try {
      const token = sessionStorage.getItem('token');
      const data = await uploadImage(newImage, token);
      const newImageUrl = `data:${data.contentType};base64,${data.image}`;
      setImages((prev) => [...prev, { url: newImageUrl, contentType: data.contentType, id: data.id }]);
    } catch (error) {
      console.error('Chyba při nahrávání obrázku:', error);
    }
  };

  // Smazání obrázku
  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('token');
      await deleteImage(id, token);
      setImages((prev) => prev.filter((image) => image.id !== id));
    } catch (error) {
      console.error('Chyba při mazání obrázku:', error);
    }
  };

  return (
    <div className="program-container">
      {/* {isAuthenticated() && ( */}
        <div className="upload-section">
          <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileChange} />
            <button className="btn btn-primary" type="submit">
              Nahrát obrázek
            </button>
          </form>
        </div>
      {/* )} */}
      <div className="image-list">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image.url} alt={`Obrázek ${index + 1}`} className="image-thumbnail" />
            {/* {isAuthenticated() && ( */}
              <button
                onClick={() => handleDelete(image.id)}
                className="btn btn-danger btn-sm ml-2"
              >
                Smazat
              </button>
            {/* )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Program;