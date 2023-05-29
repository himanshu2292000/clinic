const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {

        console.log(req.headers);
        const usertoken = req.headers['authorization'].split(' ')[1];

        jwt.verify(usertoken, process.env.JWT_SECRET, (err, decode) =>{
            if (err) {
                return res.status(200).send({
                message: "Auth Failed",
                success: false,
                });
            } else {
                req.body.userId = decode.id;
                next();
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: 'Auth Failed',
            success: false
        })
    }
}