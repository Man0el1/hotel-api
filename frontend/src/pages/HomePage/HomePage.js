import React, { useState, useEffect } from "react";

import './HomePage.css'

export default function HomePage() {
  const [tshirt, setTshirt] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/tshirt")
      .then(res => res.json()) // returns a promise
      .then(data => setTshirt(data)) // data is the json we got back
      .catch(e => console.log(e));
  }, []);

  return(
    <div className="app">
      <h1 className="title">API REST com Express</h1>
      {tshirt && (
        <p>
          {tshirt.tshirt} - {tshirt.size}
        </p>
      )}
    </div>
  )
}