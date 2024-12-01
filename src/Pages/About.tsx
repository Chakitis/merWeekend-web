import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/About.css';
import { Carousel } from 'react-bootstrap';
import TextArea from '../Components/TextArea';

const About = () => {
  const [images, setImages] = useState<{ url: string, contentType: string, id: string }[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // Stav pro režim úpravy

  // Načtení obrázků z databáze
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/images');
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
      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
      // Volání na server pro smazání obrázku
      await axios.delete(`/api/images/${id}`);

      // Aktualizace stavu po smazání obrázku
      setImages((prev) => prev.filter((image) => image.id !== id));
    } catch (error) {
      console.error('Chyba při mazání obrázku:', error);
    }
  };
  

  return (
    <div className="about-container">
      {/* Tlačítko pro přepnutí mezi režimem zobrazení a úpravy */}
      <div className="edit-toggle">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="btn btn-secondary mb-3"
        >
          {isEditing ? 'Ukončit úpravy' : 'Upravit Carousel'}
        </button>
      </div>

      {/* Carousel */}
      {!isEditing && (
        <Carousel activeIndex={activeIndex} onSelect={(index) => setActiveIndex(index)} className="carousel slide carousel-fade">
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img src={image.url} className="d-block w-100" alt={`Foto ${index + 1}`} />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* Režim úpravy */}
      {isEditing && (
        <div className="image-edit-section">
          <h3>Aktuálně vložené obrázky:</h3>
          <div className="image-list">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                {/* Náhled obrázku s malou velikostí */}
                <img src={image.url} alt={`Obrázek ${index + 1}`} className="image-thumbnail" />
                <button
                  onClick={() => handleDelete(image.id)}
                  className="btn btn-danger btn-sm ml-2"
                >
                  Smazat
                </button>
              </div>
            ))}
          </div>

          {/* Formulář pro nahrání nového obrázku */}
          <div className="upload-section mt-4">
            <form onSubmit={handleUpload}>
              <input type="file" onChange={handleFileChange} />
              <button className="btn btn-primary" type="submit">
                Nahrát obrázek
              </button>
            </form>
          </div>
        </div>
      )}
      <TextArea />
    </div>
  );
};

export default About;