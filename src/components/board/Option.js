import React from 'react';

const Option = () => {

  const moveBack = () => {
    console.info('move back');
  }

  const toggleStones = () => {
    console.info('toggle stones');
  }

  const toggleText = () => {
    console.info('toggle text');
  }

  const toggleNumbers = () => {
    console.info('toggle numbers');
  }

  const handleChange = (e) => {
    console.info(e.target.value);
  }

  return (
    <React.Fragment>
      <div>
        <h3>Options</h3>
        <h4>Events</h4>
        <button onClick={moveBack}>Move back</button>
        <button onClick={toggleStones}>Hide stones</button>
        <button onClick={toggleText}>Show text</button>
      </div>
      <div>
        <h4>Stone Color</h4>
        <input type="radio" id="radio_auto" name="stoneColor" value="auto" onChange={handleChange} />
        <label htmlFor="radio_auto">Auto</label>
        <input type="radio" id="radio_black" name="stoneColor" value="black" onChange={handleChange} />
        <label htmlFor="radio_black">Black</label>
        <input type="radio" id="radio_white" name="stoneColor" value="white" onChange={handleChange} />
        <label htmlFor="radio_white">White</label>
        <input type="radio" id="radio_mouse" name="stoneColor" value="mouse" onChange={handleChange} />
        <label htmlFor="radio_mouse">Mouse</label>
      </div>
    </React.Fragment>
  );
};

export default Option;
