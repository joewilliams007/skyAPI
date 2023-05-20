module.exports = (req, res) => {
    var { session_id } = req.params;
    var { user_id } = req.params;

    var db = require('./db');
    var authenticate = require('./authenticate');

    console.log("new reaction from session "+session_id+" user: "+user_id)

    
    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            getProfile();
        }
    })

    async function getProfile() {
        console.log("user profile (with authentication) "+user_id+" request")

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
                        profile: results[0]
                    })
                }
        });
    }
}