import React, { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import './App.css';

const App = () => {
  const [colors, setColors] = useState(["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7"]);
  const [palette, setPalette] = useState([]);
  const [mode, setMode] = useState('lighten');
  const [steps, setSteps] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const handleColorChange = (index, color) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const addColorInput = () => {
    if (colors.length < 8) {
      setColors([...colors, chroma.random().hex()]);
    }
  };

  const removeColorInput = (index) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
    }
  };

  const generateRandomPalette = () => {
    const randomColors = Array(5).fill().map(() => chroma.random().hex());
    setColors(randomColors);
  };

  const generatePalette = () => {
    const newPalette = colors.flatMap((color) => {
      if (mode === 'lighten') {
        return chroma.scale([color, 'white']).mode('lab').colors(steps);
      } else if (mode === 'darken') {
        return chroma.scale([color, 'black']).mode('lab').colors(steps);
      } else {
        return chroma.scale([color, chroma(color).set('hsl.h', '+180')]).mode('lab').colors(steps);
      }
    });
    setPalette(newPalette);
  };

  const copyToClipboard = (color, index) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    generatePalette();
  }, [colors, mode, steps]);

  return (
    <div className="App">
      <header>
        <h1>tintly</h1>
        <p>cute color palettes for your creative projects ✨</p>
      </header>

      <div className="controls">
        <div className="base-colors">
          <h2>Base Colors</h2>
          <div className="color-inputs">
            {colors.map((color, index) => (
              <div key={index} className="color-input">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  aria-label={`Color ${index + 1}`}
                />
                <button 
                  onClick={() => removeColorInput(index)} 
                  disabled={colors.length <= 2}
                  className="remove-btn"
                  aria-label="Remove color"
                >
                  ×
                </button>
              </div>
            ))}
            {colors.length < 8 && (
              <button 
                onClick={addColorInput} 
                className="add-btn"
                aria-label="Add color"
              >
                + add
              </button>
            )}
          </div>
          <button onClick={generateRandomPalette} className="random-btn">
            🎲 randomize
          </button>
        </div>

        <div className="settings">
          <h2>Settings</h2>
          <div className="setting-group">
            <label htmlFor="mode">Blend Mode:</label>
            <select 
              id="mode" 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="lighten">Lighten</option>
              <option value="darken">Darken</option>
              <option value="complementary">Complementary</option>
            </select>
          </div>
          <div className="setting-group">
            <label htmlFor="steps">Steps: {steps}</label>
            <input
              id="steps"
              type="range"
              min="3"
              max="9"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="palette-container">
        <h2>Generated Palette</h2>
        <div className="palette-grid">
          {palette.map((color, index) => {
            const textColor = chroma(color).luminance() > 0.5 ? '#000' : '#fff';
            return (
              <div
                key={index}
                className="color-swatch"
                style={{
                  backgroundColor: color,
                  color: textColor,
                  flex: `1 0 ${100 / steps}%`
                }}
                onClick={() => copyToClipboard(color, index)}
                aria-label={`Color swatch ${color}`}
              >
                <div className="color-info">
                  <p>{color}</p>
                  {copiedIndex === index && (
                    <div className="copied-notice">copied!</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer>
        <p>click colors to copy • made with 💖</p>
      </footer>
    </div>
  );
};

export default App;