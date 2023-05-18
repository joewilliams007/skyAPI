module.exports = (req, res) => {
    var { session_id } = req.params;
    var { user_id } = req.params;

    var db = require('./db');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    console.log("setting key (timestamp) for session "+session_id+" user: "+user_id)
    // why can the key just be the timestamp? isnt that insecure?
    // -> when sky verifies the key, the key must posted from the correct user_id. thus only the real owner can use the key to verify his session

    db.query(
        `INSERT INTO Auth (session_id, user_id, verify_key) 
        VALUES ("${session_id}",${user_id},${timestamp})`
        , function (error, results, fields) {
            if (error) {

                console.log('insert Auth error ' + error.message);

                res.status(200).json({
                    success: false,
                    error: true,
                    message: error.message
                })

            } else {
                res.status(200).json({
                    success: true,
                    error: false,
                    verify_key: timestamp,
                    message: "session id can be verified by commenting verify_key to the verify rant"
                })
            }
    });
}