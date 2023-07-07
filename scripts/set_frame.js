module.exports = (req, res) => {

    session_id = req.body.session_id;
    user_id = req.body.user_id;
    frame_url = req.body.frame_url;
    frame_hex_color = req.body.frame_hex_color;

    console.log(req.body)
    var db = require('./db');
    var authenticate = require('./authenticate');

    console.log("new frame data "+session_id+" user: "+user_id)
    
    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            setFrame();
        }
    })

    function setFrame(){

        db.query(
            `UPDATE Users set
            frame_url = "${frame_url}",
            frame_hex_color = "${frame_hex_color}",
            WHERE user_id = ${user_id}`
            , function (error, results, fields) {
                if (error) {

                    console.log('frame set error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })

                } else {
                    console.log('frame set successfull');

                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "frame set success"
                    })
                }

            });
    }
}