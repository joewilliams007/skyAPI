module.exports = (req, res) => {
    var { user_id } = req.params;

    var db = require('./db');
   
    console.log("user profile "+user_id+" request")

    db.query(
        `SELECT *
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
                    profile: {
                        user_id: results[0].user_id,
                        avatar: results[0].avatar,
                        username: results[0].username,
                        color: results[0].color,
                        background: results[0].background
                    }
                })
            }
    });
}