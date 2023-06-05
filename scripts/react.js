module.exports = (req, res) => {
    var { session_id } = req.params;
    var { user_id } = req.params;
    var { post_id } = req.params;
    var { reaction } = req.params;

    var db = require('./db');
    var authenticate = require('./authenticate');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    console.log("new reaction from session "+session_id+" user: "+user_id)

    
    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            checkCount();
        }
    })

    // check if reaction of user already exist. if, then delete existing reaction
    function checkCount() {
        db.query(
            `SELECT COUNT(*) AS RowCount FROM Reaction WHERE user_id = ${user_id} AND post_id = ${post_id}`
            , function (error, results, fields) {

                if (error) {
                    console.log(error);

                    res.status(200).json({ 
                        success: false,
                        error: true,
                        message: "error\n\n"+error })
                } else {
                    if (Number(results[0].RowCount) == 0) {
                        setReaction();
                    } else {
                        deleteReaction();
                    
                    }

                }
        });
    }

    function deleteReaction() {
        db.query(
            `DELETE FROM Reaction
            WHERE user_id = ${user_id} AND post_id = ${post_id}`
            , function (error, results, fields) {
                if (error) {
                    console.log('database error ' + error.message);

                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })
    
                } else {
                    updateReaction(-1)
                    setReaction();
                }
        })
    }

    function setReaction() {
        var emojiRegex = /\p{Emoji}/u;
   
        if(emojiRegex.test(reaction)) {
            db.query(
                `INSERT INTO Reaction (user_id, post_id, reaction, timestamp) 
                VALUES (${user_id},${post_id},"${reaction}",${timestamp})`
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
                            message: "reaction has been set"
                        })

                        updateReaction(1);
                    }
            });
        } else {
            console.log("not an emoji")
            res.status(200).json({
                success: false,
                error: true,
                message: "not a valid emoji"
            })
        }
      
    }

    function updateReaction(update) {
        db.query(
            `UPDATE Users SET reactions = reactions+${update}`
            , function (error, results, fields) {
                if (error) {
    
                    console.error('update reaction error ' + error.message);
    
                } else {

                    console.error('reactions updated by ' + update);
    
                }
        });
    }
}