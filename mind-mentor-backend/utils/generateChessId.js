const generateChessId = () => {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generates a 7-digit number
    return `MM${randomNum}`;
};


module.exports = generateChessId