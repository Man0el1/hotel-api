import React, { useState } from "react";

import './App.css'

export default function App() {
  const [tshirt, setTshirt] = useState(null);

  useEffect(() => {
    fetch("https://localhost:8080/tshirt")
      .then(res => res.json())
      .then(data => setTshirt(data)); // data is the json we got back
  }, []);

  return (
    <>
      <div className="app">
        <h1 className="title">API REST com Express</h1>
        {tshirt && (
          <p>
            {tshirt.tshirt} - {tshirt.size}
          </p>
        )}
      </div>
    </>
  );
}
