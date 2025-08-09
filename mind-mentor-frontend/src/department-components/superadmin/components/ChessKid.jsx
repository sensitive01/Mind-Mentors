import React, { useState } from "react";
import { getRFID } from "../../../api/service/employee/EmployeeService";

const ChessKidButton = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCount = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRFID()
      console.log(response)
 
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button
        onClick={fetchCount}
        disabled={loading}
        style={{
          backgroundColor: "#642b8f",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Loading..." : "Get ChessKid Count"}
      </button>

      {count && typeof count === "object" && (
        <div
          style={{
            marginTop: "16px",
            textAlign: "left",
            maxWidth: "400px",
            margin: "16px auto",
          }}
        >
          <h3>Chess Statistics:</h3>
          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            {count.slowWins && (
              <div>
                <strong>Slow Chess:</strong> {count.slowWins} wins,{" "}
                {count.slowLosses} losses
              </div>
            )}
            {count.blitzWins && (
              <div>
                <strong>Blitz:</strong> {count.blitzWins} wins,{" "}
                {count.blitzLosses} losses
              </div>
            )}
            {count.puzzleCorrect && (
              <div>
                <strong>Puzzles:</strong> {count.puzzleCorrect} correct out of{" "}
                {count.puzzleAttempted} attempted
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "16px", color: "red" }}>Error: {error}</div>
      )}
    </div>
  );
};

export default ChessKidButton;
