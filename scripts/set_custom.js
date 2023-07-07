module.exports = (req, res) => {

    session_id = req.body.session_id;
    user_id = req.body.user_id;
    avatar_frame_url = req.body.avatar_frame_url;
    avatar_bg_hex = req.body.avatar_bg_hex;
    avatar_bg_url = req.body.avatar_bg_url;
    profile_bg_url = req.body.profile_bg_url;

    console.log(req.body)
    var db = require('./db');
    var authenticate = require('./authenticate');

    console.log("new frame data "+session_id+" user: "+user_id)
    
    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            setCustom();
        }
    })

    function setCustom(){

        db.query(
            `UPDATE Users set
            avatar_frame_url = "${avatar_frame_url}",
            avatar_bg_hex = "${avatar_bg_hex}",
            avatar_bg_url = "${avatar_bg_url}",
            profile_bg_url = "${profile_bg_url}",
            WHERE user_id = ${user_id}`
            , function (error, results, fields) {
                if (error) {

                    console.log('setCustom error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })

                } else {
                    console.log('setCustom successfull');

                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "setCustom success"
                    })
                }

            });
    }
}