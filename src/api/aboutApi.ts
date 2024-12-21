import axios from 'axios';

const BASE_URL = 'http://localhost:5124';
const API_TEXT_URL = `${BASE_URL}/api/about`;
const API_IMAGES_URL = `${BASE_URL}/api/about/images`;

export const fetchText = async () => {
  try {
    const response = await axios.get(`${API_TEXT_URL}/text`);
    return response.data;
  } catch (error) {
    console.error('Chyba při načítání textu:', error);
    throw error;
  }
};

export const fetchImages = async () => {
  try {
    const response = await axios.get(API_IMAGES_URL);
    return response.data;
  } catch (error) {
    console.error('Chyba při načítání obrázků:', error);
    throw error;
  }
};

export const uploadImage = async (image: File, token: string | null) => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await axios.post(`${API_IMAGES_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Chyba při nahrávání obrázku:', error);
    throw error;
  }
};

export const deleteImage = async (id: string, token: string | null) => {
  try {
    await axios.delete(`${API_IMAGES_URL}/${id}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
  } catch (error) {
    console.error('Chyba při mazání obrázku:', error);
    throw error;
  }
};

export const saveText = async (text: string, token: string | null) => {
  try {
    await axios.post(
      `${API_TEXT_URL}/text`,
      { content: text },
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      }
    );
  } catch (error) {
    console.error('Chyba při ukládání textu:', error);
    throw error;
  }
};