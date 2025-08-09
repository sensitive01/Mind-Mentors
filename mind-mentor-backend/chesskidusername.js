import axios from "axios";

const getChessKidUsernames = async () => {
  try {
    const response = await axios.get(
      "https://www.chesskid.com/api/v1/users/usernames",
      {
        params: {
          usernamesCount: 9, // query parameter
        },
      }
    );

    console.log("ChessKid API Response:", response.data);
  } catch (error) {
    console.error("Error fetching ChessKid usernames:", error.message);
  }
};

// Call the function
getChessKidUsernames();
