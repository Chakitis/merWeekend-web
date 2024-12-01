import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';
import '../Styles/TextArea.css';

const TextEditor = () => {
  const [text, setText] = useState<string>('Původní text pro zobrazení a úpravy.');
  const [isEditable, setIsEditable] = useState<boolean>(false); // Režim editace
  const [isBionic, setIsBionic] = useState<boolean>(() => {
    return localStorage.getItem('bionicEnabled') === 'true'; // Načtení z localStorage
  });

  useEffect(() => {
    // Načtení textu z databáze při načtení komponenty
    const fetchText = async () => {
      try {
        const response = await axios.get('/api/text');
        if (response.data) {
          setText(response.data.content);
        }
      } catch (error) {
        console.error('Chyba při načítání textu:', error);
      }
    };

    fetchText();
  }, []);

  // Přepnutí režimu editace
  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  // Přepnutí režimu Bionic
  const toggleBionic = () => {
    setIsBionic((prev) => {
      const newValue = !prev;
      localStorage.setItem('bionicEnabled', newValue.toString());
      return newValue;
    });
  };

  // Konverze textu na Bionic
  const convertToBionic = (text: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const traverse = (node: ChildNode) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent?.split(' ') || [];
        const bionicWords = words.map((word) => {
          const mid = Math.ceil(word.length / 2);
          return `<b>${word.slice(0, mid)}</b>${word.slice(mid)}`;
        });
        const bionicText = bionicWords.join(' ');
        const span = document.createElement('span');
        span.innerHTML = bionicText;
        node.replaceWith(span);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (!['H1', 'H2', 'B'].includes(element.tagName)) {
          Array.from(node.childNodes).forEach(traverse);
        }
      }
    };

    Array.from(doc.body.childNodes).forEach(traverse);
    return doc.body.innerHTML;
  };

  // Aplikace formátování na vybraný text
  const applyFormatting = (command: keyof CSSStyleDeclaration, value: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    (span.style as any)[command] = value;
    range.surroundContents(span);
  };

  // Uložení obsahu textu (pro budoucí použití)
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.innerHTML);
  };

  // Uložení textu do databáze
  const saveText = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post('/api/text/save', { content: text }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      console.log('Text byl úspěšně uložen!');
    } catch (error) {
      console.error('Chyba při ukládání textu:', error);
    }
  };

  return (
    <div className="text-area-section">
      {/* Toolbar pouze pro admina */}
      {isEditable && (
        <div className="toolbar">
          <button onClick={() => applyFormatting('fontWeight', 'bold')} className="btn">
            Tučně
          </button>
          <button onClick={() => applyFormatting('fontSize', '2em')} className="btn">
            Nadpis H1
          </button>
          <button onClick={() => applyFormatting('fontSize', '1.5em')} className="btn">
            Nadpis H2
          </button>
        </div>
      )}

      {/* Textová oblast */}
      <div
        className={`text-editor ${isBionic ? 'bionic-text' : ''}`}
        contentEditable={isEditable}
        dangerouslySetInnerHTML={{
          __html: isBionic ? convertToBionic(text) : text,
        }}
        onInput={handleContentChange} // Sleduje změny obsahu
      ></div>

      {/* Ovládací tlačítka */}
      {isAuthenticated() && (
        <div className="editor-controls">
          <button
            onClick={() => {
              toggleEdit();
              if (isEditable) saveText();
            }}
            className="btn"
          >
            {isEditable ? 'Uložit změny' : 'Upravit text'}
          </button>
        </div>
      )}

      {/* Tlačítko pro zapnutí Bionic písma */}
      <div className="bionic-controls">
        <button onClick={toggleBionic} className="btn">
          {isBionic ? 'Vypnout přizpůsobení pro ADHD' : 'Přizpůsobení pro ADHD'}
        </button>
      </div>
    </div>
  );
};

export default TextEditor;