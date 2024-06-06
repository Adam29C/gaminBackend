const axios = require("axios");
const messages = require("../../helper/messages");
let match_token = process.env.MATCH_TOKEN
const getAllMatchesList = async (req, res) => {
    try {
        const response = await axios.get(` https://rest.entitysport.com/exchange/matches?token=${match_token}&type=mixed&per_page=20`);
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
};

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
};

const getMatchList = async (req, res) => {
    try {
        const {seriesId}=req.params;
        if(!seriesId){
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                message: "series id required"
            });
        }
        const response = await axios.get(`https://rest.entitysport.com/exchange/competitions/${seriesId}/matches?token=${match_token}&type=mixed`);
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
            msg: messages.failure
        });
    }
};

const matchDetails =async(req,res)=>{
    try{
        const {matchId}=req.params;
        if(!matchId){
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                message: "Match id required"
            });
        }
        const response = await axios.get(`https://rest.entitysport.com/exchange/matches/${matchId}/odds?token=${match_token}`);
        const allMatchesList = response.data;
        return res.status(200).send({
            statusCode: 200,
            status: "success",
            data: allMatchesList
        });
    }catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: messages.failure
        });
    }
};

const getMatchScore=async(req,res)=>{
    try{
        const {matchId}=req.params;
        if(!matchId){
            return res.status(400).send({
                statusCode: 400,
                status: "failure",
                message: "Match id required"
            });
        }
        const response = await axios.get(`https://rest.entitysport.com/exchange/matches/${matchId}/innings/1/commentary?token=${match_token}`);
        const allMatchesList = response.data;
        return res.status(200).send({
            statusCode: 200,
            status: "success",
            data: allMatchesList
        });
    }catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: messages.failure
        });
    }
};

module.exports={
    getAllMatchesList,
    getSeriesList,
    getMatchList,
    matchDetails,
    getMatchScore,
};