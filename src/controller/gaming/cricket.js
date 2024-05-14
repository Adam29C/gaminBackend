const { axios } = require("axios");
let match_token = process.env.MATCH_TOKEN
const getAllMatchesList = async (req, res) => {
    try {
        let allmatchesList = await axios.get(`https://rest.entitysport.com/exchange/matches?token=${match_token}&status=3`);
        return res.status(200).send({
            statusCode: 200,
            status: "success",
            data: allmatchesList
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
// const getSeriesList = async (req, res) => {
//     try {

//     } catch (error) {
//         return res.status(500).send({
//             statusCode: 500,
//             status: "failure",
//             msg: "Internal Server Error"
//         });
//     }
// }

// const getMatchsList = async (req, res) => {
//     try {

//     } catch (error) {
//         return res.status(500).send({
//             statusCode: 500,
//             status: "failure",
//             msg: "Internal Server Error"
//         });
//     }
// }

module.exports={
    getAllMatchesList
}