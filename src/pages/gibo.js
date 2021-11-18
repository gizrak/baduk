import React, { useEffect } from 'react';

const GiboPage = () => {
  useEffect(() => {
    // update the document title
    document.title = 'Gibo — Baduk';
  });

  return (
    <div>
      <p>This is Gibo</p>
    </div>
  );
};

export default GiboPage;
