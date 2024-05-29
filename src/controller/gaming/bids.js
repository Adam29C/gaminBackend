const bids = require("../../model/bids");
const Users = require("../../model/user");

const createBids = async (req, res) => {
    try {
         const { userId, bidAmount, bidParsent, teamid, teamName, selectOptionName,} = req.body
    } catch (error) {
        return res.status(500).send({
            status: "failure",
            statusCode: 500,
            msg: error.message
        });
    }
}