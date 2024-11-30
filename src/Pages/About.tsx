import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/About.css';

const About = () => {
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Načtení obrázků z databáze
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        const base64Images = response.data.map((img: any) =>
          img.url ? img.url : null
        ).filter(Boolean);
        setImages(base64Images);
      } catch (error) {
        console.error('Chyba při načítání obrázků:', error);
      }
    };

    fetchImages();
  }, []);

  // Automatické otáčení obrázků
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000); // Změna obrázku každé 3 sekundy

    return () => clearInterval(interval); // Vyčištění intervalu při odpojení komponenty
  }, [images.length]);

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
      const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Úspěšné nahrání obrázku:', response.data);
      const newImageUrl = `data:${response.data.contentType};base64,${response.data.image}`;
      setImages((prev) => [...prev, newImageUrl]);
    } catch (error) {
      console.error('Chyba při nahrávání obrázku:', error);
    }
  };

  // Funkce pro nastavení aktivního obrázku
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
    <div className="about-container">
      {/* Carousel */}
      <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          {images.map((_, index) => (
            <li
              key={index}
              data-target="#carouselExampleIndicators"
              data-slide-to={index}
              className={index === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
            ></li>
          ))}
        </ol>
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
              <img src={image} className="d-block w-100" alt={`Foto ${index + 1}`} />
            </div>
          ))}
        </div>
        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" onClick={handlePrev}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" onClick={handleNext}>
        </a>
      </div>
      {/* File upload */}
      <div className="upload-section mt-4">
        <form onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} />
          <button className="btn btn-primary" type="submit">
            Nahrát obrázek
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default About;