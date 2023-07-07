module.exports = (req, res) => {
    var { user_id } = req.params;

    var db = require('./db');

    var { user_id } = req.params;

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
                db.query(
                    `SELECT Reaction.*, Users.avatar, Users.username, Users.color, Users.avatar_frame_url, Users.avatar_bg_hex, Users.avatar_bg_url, Users.profile_bg_url
                    FROM Reaction
                    INNER JOIN Users ON Reaction.user_id=Users.user_id
                    WHERE Users.user_id = ${user_id}
                    ORDER BY timestamp DESC
                    LIMIT 50`
                

                    , function (error, react_results, fields) {
                        if (error) {
            
                            console.error('error ' + error.message);
            
                            res.status(200).json({
                                success: true,
                                error: false,
                                message: "ok",
                                profile: {
                                    user_id: results[0].user_id,
                                    avatar: results[0].avatar,
                                    username: results[0].username,
                                    color: results[0].color,
                                    background: results[0].background,
                                    timestamp: results[0].timestamp,
                                    reactions_count: results[0].reactions,
                                    avatar_frame_url: results[0].avatar_frame_url,
                                    avatar_bg_hex: results[0].avatar_bg_hex,
                                    avatar_bg_url: results[0].avatar_bg_url,
                                    profile_bg_url: results[0].profile_bg_url
                                }
                            })
            
                        } else {
                            try  {
                                res.status(200).json({
                                    success: true,
                                    error: false,
                                    message: "ok",
                                    profile: {
                                        user_id: results[0].user_id,
                                        avatar: results[0].avatar,
                                        username: results[0].username,
                                        color: results[0].color,
                                        background: results[0].background,
                                        timestamp: results[0].timestamp,
                                        reactions_count: results[0].reactions,
                                        avatar_frame_url: results[0].avatar_frame_url,
                                        avatar_bg_hex: results[0].avatar_bg_hex,
                                        avatar_bg_url: results[0].avatar_bg_url,
                                        profile_bg_url: results[0].profile_bg_url,
                                        reactions: react_results
                                    }
                                })
                            } catch (err) {
                                res.status(200).json({
                                    success: false,
                                    error: false,
                                    message: "user not registered to sky",
                                    profile: {}
                                })
                            }
                           
                        }
                });
            }
    });
}