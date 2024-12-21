import axios from 'axios';

const BASE_URL = 'http://localhost:5124';
const API_TEXT_URL =  `${BASE_URL}/api/eventLocation`;

export const fetchText = async () => {
  try {
    const response = await axios.get(`${API_TEXT_URL}/text`);
    return response.data;
  } catch (error) {
    console.error('Chyba při načítání textu:', error);
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