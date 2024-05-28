const bids = require("../../model/bids");
const Users=require("../../model/user");
const createBids = async (req, res) => {
    try {
        const { userId, bidAmount, bidParsent, teamid, teamName, selectOptionid, selectOptionName } = req.body;
        if(!userId){

        }
        let userDetails = await Users.findOne({_id:userId});
        if(!userDetails){

        }
        let winAmount;
        if(selectOptionName.toLowerCase()==="back"){
            winAmount= bidAmount * bidParsent;
        }

    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
}