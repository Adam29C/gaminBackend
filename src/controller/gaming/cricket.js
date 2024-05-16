const axios = require("axios");
let match_token = process.env.MATCH_TOKEN
const getAllMatchesList = async (req, res) => {
    try {
        const response = await axios.get(`https://rest.entitysport.com/exchange/matches?token=${match_token}&status=3`);
        const allMatchesList = response.data;
        return res.status(200).send({
            statusCode: 200,
            status: "success",
            data: allMatchesList
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: "Internal Server Error"
        });
    }
}
const getSeriesList = async (req, res) => {
    try {
        const response = await axios.get(`https://rest.entitysport.com/exchange/competitions?token=${match_token}&status=live`);
        const allMatchesList = response.data;
        return res.status(200).send({
            statusCode: 200,
            status: "success",
            data: allMatchesList
        });
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: "Internal Server Error"
        });
    }
}

const getMatchsList = async (req, res) => {
    try {
        const {seriesId}=req.params;
        if(!seriesId){
            return res.status(400).send({
                statusCode: 400,
                status: "success",
                data: allMatchesList
            });
        }
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: "Internal Server Error"
        });
    }
}

module.exports={
    getAllMatchesList,
    getSeriesList
}