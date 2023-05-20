module.exports = (req, res) => {

    session_id = req.body.session_id;
    user_id = req.body.user_id;
    following = req.body.following;
    blocked_words = req.body.blocked_words;
    blocked_users = req.body.blocked_users;

    console.log(req.body)
    var db = require('./db');
    var authenticate = require('./authenticate');

    console.log("new backup data "+session_id+" user: "+user_id)

    
    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            backupData();
        }
    })

    function backupData(){

        db.query(
            `UPDATE Users set
            following = "${following}",
            blocked_words = "${blocked_words}",
            blocked_users = "${blocked_users}"
            WHERE user_id = ${user_id}`
            , function (error, results, fields) {
                if (error) {

                    console.log('backup error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })

                } else {
                    console.log('backup successfull');

                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "backup success"
                    })
                }

            });
    }
}