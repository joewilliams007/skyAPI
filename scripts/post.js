module.exports = (req, res) => {
    var { post_id } = req.params;

    var db = require('./db');
   
    console.log("post "+post_id+" request")

    db.query(
        `SELECT Reaction.*, Users.avatar, Users.username, Users.color
        FROM Reaction
        INNER JOIN Users ON Reaction.user_id=Users.user_id
        WHERE post_id = ${post_id}
        ORDER BY timestamp ASC`
    
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
                    reactions: results
                })
            }
    });
}