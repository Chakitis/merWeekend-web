import React, { useState } from 'react';

const Admin = () => {
  const [text, setText] = useState('Lorem ipsum dolor sit amet...');

interface ChangeEvent {
    target: {
        value: string;
    };
}

const handleChange = (e: ChangeEvent) => {
    setText(e.target.value);
};

  const handleSave = () => {
    alert('Text saved');
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <textarea value={text} onChange={handleChange} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Admin;