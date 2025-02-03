import { useState } from 'react';
import useStyleStore from '../../../utils/useStyleStore';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const Settings = () => {
  const { setTheme } = useStyleStore();
  const [color, setColor] = useState<string>('#3498db');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<string>('16px');

  const handleApply = () => {
    setTheme({ primaryColor: color, backgroundColor: bgColor, fontSize });
  };

  return (
    <div className="settings">
      <SettingsContainer>
        <h3>Paramètres de Style</h3>
        <label>
          Couleur principale:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <label>
          Couleur de fond:
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </label>
        <label>
          Taille de police:
          <input type="number" value={parseInt(fontSize)} onChange={(e) => setFontSize(e.target.value + 'px')} />
        </label>
        <button onClick={handleApply}>Appliquer</button>
      </SettingsContainer>
    </div>
  );
};

export default Settings;
