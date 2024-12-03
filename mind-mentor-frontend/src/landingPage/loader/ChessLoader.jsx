import "./ChessLoader.css";
import chessImage from "../../images/chessicon.jfif";

const ChessLoader = () => {
  return (
    <div className="loader-container">
      <div className="chess-piece">
        <img src={chessImage} alt="Loading..." />
      </div>
    </div>
  );
};

export default ChessLoader;
