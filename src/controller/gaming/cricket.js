const axios = require("axios");
const messages = require("../../helper/messages");
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
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: messages.failure
        });
    }
}
const getSeriesList = async (req, res) => {
    try {
        const response = await axios.get(`https://rest.entitysport.com/exchange/competitions?token=${match_token}&status=live`);
        const seriesList = response.data;
        return res.status(200).send({
            statusCode: 200,
            status: "success",
            data: seriesList
        });
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: messages.failure
        });
    }
}

const getMatchsList = async (req, res) => {
    try {
        const {seriesId}=req.params;
        if(!seriesId){
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                message: "series id required"
            });
        }
        const response = await axios.get(`https://rest.entitysport.com/exchange/competitions/${seriesId}/matches?token=a847b9eda5b69a7cae7d1edb0ee2cd30&type=mixed`);
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
            msg: messages.failure
        });
    }
}

module.exports={
    getAllMatchesList,
    getSeriesList,
    getMatchsList
}