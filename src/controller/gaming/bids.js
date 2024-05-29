const bids = require("../../model/bids");
const Users = require("../../model/user");

const createBids = async (req, res) => {
    try {
        const { userId, bidAmount, bidParsent, teamid, teamName, batingType, batingOption, fancyid } = req.body;
        if (!userId) {
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                message: "series id required"
            });
        }
        let userDetails = await Users.findOne({_id:userId});
        if(!userDetails){

        }
        let totalAmount=0;
        if(batingOption==="matchodds" || batingOption==="tiedmatch" || batingOption ==="bookmaker"){
          totalAmount
        }
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
}