import { useState, useEffect } from 'react';
import { fetchText, fetchImages, uploadImage, deleteImage, replaceImage, saveText } from '../api/eventRulesApi';
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

  const handleReplace = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      try {
        const token = sessionStorage.getItem('token');
        const data = await replaceImage(id, newFile, token);
        const newImageUrl = `data:${data.contentType};base64,${data.image}`;
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
          <TextArea text={text} onTextChange={handleTextChange} onSave={handleSaveText} />
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