module.exports = (req, res) => {
    session_id = req.body.session_id;
    user_id = req.body.user_id;

    var db = require('./db');
    var authenticate = require('./authenticate');

    console.log("delete account "+session_id+" user: "+user_id)

    
    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            deleteData();
        }
    })

    function deleteData(){

        db.query(
            `DELETE FROM Users
            WHERE user_id = ${user_id}`
            , function (error, results, fields) {
                if (error) {

                    console.log('delete error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })

                } else {
                    console.log('delete successfull');

                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "delete success"
                    })
                }

            });
    }
}