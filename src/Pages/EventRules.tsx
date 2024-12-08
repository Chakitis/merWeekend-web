import { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';
import TextArea from '../Components/TextArea';
import '../Styles/EventRules.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventRules = () => {
  const [text, setText] = useState<string>('');
  const [images, setImages] = useState<{ url: string, contentType: string, id: string }[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Načtení textu z databáze
  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await axios.get('/api/eventRules/text');
        if (response.data) {
          setText(response.data.content);
        }
      } catch (error) {
        console.error('Chyba při načítání textu:', error);
      }
    };

    fetchText();
  }, []);

  // Načtení obrázků z databáze
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/eventRules/images');
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
      const response = await axios.post('/api/eventRules/images/upload', formData, {
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
      await axios.delete(`/api/eventRules/images/${id}`, {
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

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const saveText = async (text: string) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(
        '/api/eventRules/text',
        { content: text },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      console.log('Text byl úspěšně uložen!');
    } catch (error) {
      console.error('Chyba při ukládání textu:', error);
    }
  };

  const handleReplace = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', newFile);
  
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.put(`/api/eventRules/images/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
  
        const newImageUrl = `data:${response.data.contentType};base64,${response.data.image}`;
        setImages((prev) =>
          prev.map((image) =>
            image.id === id ? { ...image, url: newImageUrl } : image
          )
        );
      } catch (error) {
        console.error('Chyba při nahrazování obrázku:', error);
      }
    }
  };

  return (
    <div className="container event-rules-container">
      <div className="row row-centered mb-4">
        <div className="col-md-4">
          {images.slice(0, 1).map((image) => (
            <div key={image.id} className="image-item small-image-header">
              <img src={image.url} alt={`Obrázek ${image.id}`} className="img-fluid rounded shadow-sm" />
              {isAuthenticated() && (
                <div className="image-controls">
                  <button className="btn btn-danger mt-2" onClick={() => handleDelete(image.id)}>Smazat</button>
                  <label className="btn btn-secondary mt-2">
                    Nahradit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplace(image.id, e)}
                      hidden
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="col-md-2 d-flex align-items-center justify-content-center">
          <h1 className="title">Pravidla</h1>
        </div>
        <div className="col-md-4">
          {images.slice(1, 2).map((image) => (
            <div key={image.id} className="image-item small-image-header">
              <img src={image.url} alt={`Obrázek ${image.id}`} className="img-fluid rounded shadow-sm" />
              {isAuthenticated() && (
                <div className="image-controls">
                  <button className="btn btn-danger mt-2" onClick={() => handleDelete(image.id)}>Smazat</button>
                  <label className="btn btn-secondary mt-2">
                    Nahradit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplace(image.id, e)}
                      hidden
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-2">
          {images.slice(2, 3).map((image) => (
            <div key={image.id} className="image-item small-image">
              <img src={image.url} alt={`Obrázek ${image.id}`} className="img-fluid rounded shadow-sm" />
              {isAuthenticated() && (
                <div className="image-controls">
                  <button className="btn btn-danger mt-2" onClick={() => handleDelete(image.id)}>Smazat</button>
                  <label className="btn btn-secondary mt-2">
                    Nahradit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplace(image.id, e)}
                      hidden
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="col-md-8">
          <TextArea text={text} onTextChange={handleTextChange} onSave={saveText} />
        </div>
        <div className="col-md-2">
          {images.slice(3, 4).map((image) => (
            <div key={image.id} className="image-item small-image">
              <img src={image.url} alt={`Obrázek ${image.id}`} className="img-fluid rounded shadow-sm" />
              {isAuthenticated() && (
                <div className="image-controls">
                  <button className="btn btn-danger mt-2" onClick={() => handleDelete(image.id)}>Smazat</button>
                  <label className="btn btn-secondary mt-2">
                    Nahradit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplace(image.id, e)}
                      hidden
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="row mb-4">
        {images.slice(4, 7).map((image) => (
          <div key={image.id} className="col-md-4">
            <div className="image-item">
              <img src={image.url} alt={`Obrázek ${image.id}`} className="img-fluid rounded shadow-sm" />
              {isAuthenticated() && (
                <div className="image-controls">
                  <button className="btn btn-danger mt-2" onClick={() => handleDelete(image.id)}>Smazat</button>
                  <label className="btn btn-secondary mt-2">
                    Nahradit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplace(image.id, e)}
                      hidden
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {isAuthenticated() && (
        <div className="upload-section">
          <form onSubmit={handleUpload}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button className="btn btn-primary mt-2" type="submit">Nahrát obrázek</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EventRules;