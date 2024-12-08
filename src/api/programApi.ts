import axios from 'axios';

const API_URL = '/api/program';


export const fetchImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/images`);
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
    const response = await axios.post(`${API_URL}/images/upload`, formData, {
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
    await axios.delete(`${API_URL}/images/${id}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
  } catch (error) {
    console.error('Chyba při mazání obrázku:', error);
    throw error;
  }
};

export const replaceImage = async (id: string, image: File, token: string | null) => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await axios.put(`${API_URL}/images/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Chyba při nahrazování obrázku:', error);
    throw error;
  }
};
