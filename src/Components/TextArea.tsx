import React, { useState, useEffect } from "react";
import "../Styles/TextArea.css";

const TextEditor = () => {
  const [text, setText] = useState<string>("Původní text pro zobrazení a úpravy.");
  const [isEditable, setIsEditable] = useState<boolean>(false); // Režim editace
  const [isBionic, setIsBionic] = useState<boolean>(() => {
    return localStorage.getItem("bionicEnabled") === "true"; // Načtení z localStorage
  });

  // Přepnutí režimu editace
  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  // Přepnutí režimu Bionic
  const toggleBionic = () => {
    setIsBionic((prev) => {
      const newValue = !prev;
      localStorage.setItem("bionicEnabled", newValue.toString());
      return newValue;
    });
  };

  // Konverze textu na Bionic
  const convertToBionic = (text: string) => {
    return text
      .split(" ")
      .map((word) => {
        const mid = Math.ceil(word.length / 2);
        return `<b>${word.slice(0, mid)}</b>${word.slice(mid)}`;
      })
      .join(" ");
  };

  // Aplikace formátování na vybraný text
  const applyFormatting = (command: keyof CSSStyleDeclaration, value: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    (span.style as any)[command] = value;
    range.surroundContents(span);
  };

  // Uložení obsahu textu (pro budoucí použití)
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.innerHTML);
  };

  return (
    <div className="text-area-section">
      {/* Toolbar pouze pro admina */}
      {isEditable && (
        <div className="toolbar">
          <button onClick={() => applyFormatting("fontWeight", "bold")} className="btn">
            Tučně
          </button>
          <button onClick={() => applyFormatting("fontSize", "2em")} className="btn">
            Nadpis H1
          </button>
          <button onClick={() => applyFormatting("fontSize", "1.5em")} className="btn">
            Nadpis H2
          </button>
        </div>
      )}

      {/* Textová oblast */}
      <div
        className={`text-editor ${isBionic ? "bionic-text" : ""}`}
        contentEditable={isEditable}
        dangerouslySetInnerHTML={{
          __html: isBionic ? convertToBionic(text) : text,
        }}
        onInput={handleContentChange} // Sleduje změny obsahu
      ></div>

      {/* Ovládací tlačítka */}
      <div className="editor-controls">
        <button onClick={toggleEdit} className="btn">
          {isEditable ? "Uložit změny" : "Upravit text"}
        </button>
      </div>

      {/* Tlačítko pro zapnutí Bionic písma */}
      <div className="bionic-controls">
        <button onClick={toggleBionic} className="btn">
          {isBionic ? "Vypnout Bionic písmo" : "Zapnout Bionic písmo"}
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
