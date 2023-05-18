module.exports = (req, res) => {
    var { post_id } = req.params;

    var db = require('./db');
   
    console.log("post "+post_id+" request")

    db.query(
        `SELECT Reaction.*, Reaction.user_id, Auth.user_id, Auth.username, Auth.avatar, Auth.color
        FROM Reaction WHERE post_id = ${post_id}
        LEFT JOIN Auth ON Reaction.user_id = Auth.user_id
        GROUP BY Reaction.user_id
        ORDER BY timestamp DESC`

        , function (error, results, fields) {
            if (error) {

                console.error('insert reaction error ' + error.message);

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