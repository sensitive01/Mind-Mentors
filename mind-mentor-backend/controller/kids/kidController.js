const kidModel = require("../../model/kidModel")



const validateKidChessId = async (req, res) => {
    try {
        const { chessId } = req.body;

        if (!chessId) {
            return res.status(400).json({ message: 'Chess ID is required.' });
        }

        const kid = await kidModel.findOne({ chessId },{_id:1});

        if (!kid) {
            return res.status(404).json({ message: 'Chess ID not found for any kid.' });
        }

        res.status(200).json({ message: 'Chess ID is valid.', kid });
    } catch (err) {
        console.log('Error in validating the chess ID:', err);
        res.status(500).json({ message: 'Server error while validating Chess ID.' });
    }
};


const validateKidPin = async(req,res)=>{
    try{
        const {pin,state} = req.body
        console.log("Welcome to verify pin",pin,state)

    }catch(err){
        console.log("Error in validate the pin ",err)
    }
}




module.exports = {
    validateKidChessId,
    validateKidPin

}