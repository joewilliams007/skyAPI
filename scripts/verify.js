module.exports = (req, res) => {
    var { session_id } = req.params;
    var { user_id } = req.params;

    var db = require('./db');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    console.log("setting key (timestamp) for session "+session_id+" user: "+user_id)
    // why can the key just be the timestamp? isnt that insecure?
    // -> when sky verifies the key, the key must posted from the correct user_id. thus only the real owner can use the key to verify his session

    var getJSON = require('get-json')
    var db = require('./db');


     // check if user has ever registered
     db.query(
        `SELECT COUNT(*) AS RowCount FROM Users WHERE user_id = ${user_id} LIMIT 1`
        , function (error, results, fields) {

            if (error) {
                console.log(error);

                res.status(200).json({ 
                    success: false,
                    error: true,
                    message: "error\n\n"+error })
            } else {

                if (Number(results[0].RowCount) == 0) {

                    console.log("authentication invalid");

                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "authentication invalid. user id does not exist"
                    })

                    createUser();
                } else {
                    createSession();
                }

            }
    });

    function createUser() {
        // fetch profile details such as username, avatar, color
        getJSON('https://devrant.com/api/users/'+user_id+'?app=3/')
        .then(function (response) {
            var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

            db.query(
                `INSERT INTO Users (user_id, username, avatar, color, timestamp) 
                VALUES (${user_id},"${response.profile.username}","${response.profile.avatar_sm.i}","${response.profile.avatar_sm.b},${timestamp}")`
                , function (error, results, fields) {
                    if (error) {
                    
                        console.log('insert Auth error ' + error.message);
        
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: error.message
                        })
        
                    } else {
                        createSession();
                    }
            });

        }).catch(function (error) {
            console.log(error);

            res.status(200).json({ 
                success: false,
                error: true,
                message: "error\n\n"+error })
        });
    }

   function createSession() {
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
}