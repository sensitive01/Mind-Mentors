import { useEffect, useState } from "react";

const FetchData = ({ endpoint, onDataFetched }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        onDataFetched(result); // Pass fetched data back to parent
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, onDataFetched]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return null; // Doesn't render anything, purely functional
};

export default FetchData;
