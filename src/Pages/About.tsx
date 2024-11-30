import { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/About.css';

const About = () => {
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Načtení obrázků z databáze
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/images');
        const base64Images = response.data.map((img: any) =>
          `data:${img.contentType};base64,${btoa(
            new Uint8Array(img.image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )}`
        );
        setImages(base64Images);
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
    }
  };

  // Nahrání souboru na server
  const handleUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      const response = await axios.post('http://localhost:5000/mydatabase/carouselImg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImages((prev) => [...prev, response.data.imageUrl]);
      setNewImage(null);
      alert('Obrázek byl úspěšně nahrán!');
    } catch (error) {
      console.error('Chyba při nahrávání obrázku:', error);
      alert('Nahrání obrázku selhalo.');
    }
  };

  return (
    <div className="about-container">
      {/* Carousel */}
      <div
        id="photoCarousel"
        className="carousel slide mt-4"
        data-bs-ride="carousel"
        data-bs-interval="3000"
        style={{ marginTop: '50px' }}
      >
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img src={image} className="d-block w-100" alt={`Foto ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Předchozí</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Další</span>
        </button>
      </div>

      {/* File upload */}
      <div className="upload-section mt-4">
        <input type="file" onChange={handleFileChange} />
        <button className="btn btn-primary" onClick={handleUpload}>
          Nahrát obrázek
        </button>
      </div>
    </div>
  );
};

export default About;
