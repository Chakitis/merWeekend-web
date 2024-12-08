import axios from "axios";
import { useState } from "react";
import TextArea from "../Components/TextArea";



const Contact = () => {
  const [text, setText] = useState<string>('');
  const handleTextChange = (newText: string) => {
    setText(newText);
  };
  const saveText = async (text: string) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(
        '/api/contact/text',
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
  return (
<TextArea text={text} onTextChange={handleTextChange} onSave={saveText} />
  );
};

export default Contact;