import React, { useState } from 'react';
import '../Styles/TextArea.css';

interface TextAreaProps {
  text: string;
  onTextChange: (newText: string) => void;
  onSave: (text: string) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ text, onTextChange, onSave }) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isBionic, setIsBionic] = useState<boolean>(() => {
    return localStorage.getItem('bionicEnabled') === 'true';
  });

  const isAuthenticated = () => {
    return sessionStorage.getItem('token') !== null;
  };

  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
    if (isEditable) onSave(text);
  };

  const toggleBionic = () => {
    setIsBionic((prev) => {
      const newValue = !prev;
      localStorage.setItem('bionicEnabled', newValue.toString());
      return newValue;
    });
  };

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

  const applyFormatting = (command: keyof CSSStyleDeclaration, value: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    (span.style as any)[command] = value;
    range.surroundContents(span);
  };

  const handleContentChange = (event: React.FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    onTextChange(target.innerHTML);
  };

  return (
    <div className="text-area-section">
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

      <div
        className={`text-editor ${isBionic ? 'bionic-text' : ''}`}
        contentEditable={isEditable}
        dangerouslySetInnerHTML={{
          __html: isBionic ? convertToBionic(text) : text,
        }}
        onInput={handleContentChange}
      ></div>

      {isAuthenticated() && (
        <div className="editor-controls">
          <button
            onClick={() => {
              toggleEdit();
              if (isEditable) onSave(text);
            }}
            className="btn"
          >
            {isEditable ? 'Uložit změny' : 'Upravit text'}
          </button>
          <button onClick={toggleBionic} className="btn">
            {isBionic ? 'Vypnout přizpůsobení pro ADHD' : 'Přizpůsobení pro ADHD'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TextArea;