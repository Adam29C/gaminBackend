const { logger } = require("../helper/log");

const webData = async (req, res) => {
    try {
        logger.info(`req mke data send kra hai: ${JSON.stringify(req.body)}:data yaha khatam hua hai`);
        return res.status(200).send({
            statusCode: 200,
            status: "Success",
        });
    } catch (error) {
        return res.status(500).send({
            statusCode: 500,
            status: "failure",
            msg: error
        });
    }
}

module.exports = { webData }