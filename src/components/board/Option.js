import React, { useState } from 'react';

const Option = ({ option }) => {
  
  const [colorMode, setColorMode] = useState('auto');

  const moveBack = () => {
    console.info('move back');
  }

  const toggleStones = () => {
    console.info('toggle stones');
  }

  const toggleText = () => {
    console.info('toggle text');
  }

  const handleColorModeChange = (event) => {
    setColorMode(event.target.value);
    option.colorMode = event.target.value;
  }

  return (
    <React.Fragment>
      <h3>Options</h3>
      <div>
        <h4>Events</h4>
        <button onClick={moveBack}>Move back</button>
        <button onClick={toggleStones}>Hide stones</button>
        <button onClick={toggleText}>Show text</button>
      </div>
      <div>
        <h4>Stone Color</h4>
        <input type="radio" id="radio_auto" name="colorMode" value="auto" checked={colorMode === 'auto' ? true : false} onChange={handleColorModeChange} />
        <label htmlFor="radio_auto">Auto</label>
        <input type="radio" id="radio_black" name="colorMode" value="black" checked={colorMode === 'black' ? true : false} onChange={handleColorModeChange} />
        <label htmlFor="radio_black">Black</label>
        <input type="radio" id="radio_white" name="colorMode" value="white" checked={colorMode === 'white' ? true : false} onChange={handleColorModeChange} />
        <label htmlFor="radio_white">White</label>
        <input type="radio" id="radio_mouse" name="colorMode" value="mouse" checked={colorMode === 'mouse' ? true : false} onChange={handleColorModeChange} />
        <label htmlFor="radio_mouse">Mouse</label>
      </div>
    </React.Fragment>
  );
};

export default Option;
