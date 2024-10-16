import { useState, useEffect } from "react";
import axios from "axios";

const KoiFishList = () => {
  const [koiFish, setKoiFish] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7229/api/KoiFish")
      .then((response) => setKoiFish(response.data))
      .catch((error) => console.error("Error fetching Koi Fish data:", error));
  }, []);

  return (
    <div>
      <h5>Koi Fish List</h5>
      <ul>
        {koiFish.map((fish) => (
          <li key={fish.id}>{fish.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default KoiFishList;
