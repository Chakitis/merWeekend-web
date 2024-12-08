import React, { useState, useRef, useEffect } from 'react';
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

  const editorRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = () => {
    return sessionStorage.getItem('token') !== null;
  };

  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
    if (isEditable) onSave(editorRef.current?.innerHTML || '');
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

  const handleContentChange = () => {
    if (editorRef.current) {
      const currentText = editorRef.current.innerHTML;
      onTextChange(currentText);
    }
  };

  const saveCaretPosition = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current!);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  };

  const restoreCaretPosition = (position: number) => {
    const node = editorRef.current;
    if (node) {
      const range = document.createRange();
      const sel = window.getSelection();
      let charIndex = 0;
      let stop = false;

      const traverseNodes = (currentNode: Node) => {
        if (stop) return;

        if (currentNode.nodeType === 3) { // text node
          const nextCharIndex = charIndex + currentNode.textContent!.length;
          if (position >= charIndex && position <= nextCharIndex) {
            range.setStart(currentNode, position - charIndex);
            range.setEnd(currentNode, position - charIndex);
            stop = true;
          }
          charIndex = nextCharIndex;
        } else {
          for (let i = 0; i < currentNode.childNodes.length; i++) {
            traverseNodes(currentNode.childNodes[i]);
          }
        }
      };

      traverseNodes(node);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const toggleStyle = (command: string, value?: string) => {
    if (value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command);
    }
  };
  
  const isStyleActive = (command: string): boolean => {
    return document.queryCommandState(command);
  };
  

  useEffect(() => {
    const position = saveCaretPosition();
    if (editorRef.current && isBionic) {
      editorRef.current.innerHTML = convertToBionic(text);
    } else if (editorRef.current) {
      editorRef.current.innerHTML = text;
    }
    restoreCaretPosition(position);
  }, [text, isBionic]);

  return (
    <div className="text-area-section">
      {isEditable && (
        <div className="toolbar">
          <button
            onClick={() => toggleStyle('bold')}
            className={`btn ${isStyleActive('bold') ? 'active' : ''}`}
          >
            Tučně
          </button>
          <button
            onClick={() => toggleStyle('formatBlock', 'H1')}
            className={`btn ${isStyleActive('formatBlock') && editorRef.current?.innerHTML.includes('<h1>') ? 'active' : ''}`}
          >
            Nadpis H1
          </button>
          <button
            onClick={() => toggleStyle('formatBlock', 'H2')}
            className={`btn ${isStyleActive('formatBlock') && editorRef.current?.innerHTML.includes('<h2>') ? 'active' : ''}`}
          >
            Nadpis H2
          </button>
        </div>
      )}
  
      <div
        ref={editorRef}
        className={`text-editor ${isBionic ? 'bionic-text' : ''}`}
        contentEditable={isEditable}
        onInput={handleContentChange}
      ></div>
  
      {isAuthenticated() && (
        <div className="editor-controls">
          <button
            onClick={() => {
              toggleEdit();
              if (isEditable) onSave(editorRef.current?.innerHTML || '');
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
