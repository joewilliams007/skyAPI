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
            setReaction();
        }
    })

    function setReaction() {
        db.query(
            `INSERT INTO Reaction (user_id, post_id, emojie, timestamp) 
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
                }
        });
    }
}