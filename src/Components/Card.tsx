import { useState } from 'react';
import '../Styles/Card.css';

const Card = ({ isAdmin }: { isAdmin: boolean }) => {
  const [text, setText] = useState(
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
    ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
  );

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save text (např. uložit na server)
  };

  return (
    <div className="card">
      <div className="card-content">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="card-textarea"
          />
        ) : (
          <p>{text}</p>
        )}
      </div>
      {isAdmin && (
        <div className="card-actions">
          {isEditing ? (
            <button onClick={handleSave} className="save-button">
              Uložit
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Upravit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;