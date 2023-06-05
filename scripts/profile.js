module.exports = (req, res) => {
    var { user_id } = req.params;

    var db = require('./db');

    var { user_id } = req.params;

    console.log("user profile "+user_id+" request")

    db.query(
        `SELECT

        user_id,
        avatar,
        username,
        color,
        reactions,
        background,
        timestamp

        FROM Users
        WHERE user_id = ${user_id}
        LIMIT 1`
    
        , function (error, results, fields) {
            if (error) {

                console.error('error ' + error.message);

                res.status(200).json({
                    success: false,
                    error: true,
                    message: error.message
                })

            } else {
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    profile: results
                })
            }
    });
}