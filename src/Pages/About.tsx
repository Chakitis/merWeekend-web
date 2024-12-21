import { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';
import '../Styles/About.css';
import { Carousel } from 'react-bootstrap';
import TextArea from '../Components/TextArea';
import { deleteImage, fetchImages, fetchText, saveText, uploadImage } from '../api/aboutApi';

const About = () => {
  const [images, setImages] = useState<{ url: string, contentType: string, id: string }[]>([]);
  const [text, setText] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false); 

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
  //uložení textu
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
    <div className="about-container">
      {/* Tlačítko pro přepnutí mezi režimem zobrazení a úpravy */}
      {isAuthenticated() && (
        <div className="edit-toggle">
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="btn btn-secondary mb-3"
          >
            {isEditing ? 'Ukončit úpravy' : 'Upravit Carousel'}
          </button>
        </div>
      )}

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
      <TextArea text={text} onTextChange={handleTextChange} onSave={handleSaveText} />
    </div>
  );
};

export default About;