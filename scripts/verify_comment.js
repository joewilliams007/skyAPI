module.exports = (req, res) => {
    var { session_id } = req.params;
    var { user_id } = req.params;

    console.log("verify key on post session "+session_id+" user: "+user_id)

    var getJSON = require('get-json')
    var db = require('./db');

    // get comments from devRant post
    getJSON('https://devrant.com/api/devrant/rants/6608716?app=3/')
        .then(function (response) {

            var keyVerify = false;

            // get *latest* key from database and compare with key from devRant post
            db.query(
                `SELECT verify_key FROM Auth WHERE user_id = ${user_id} AND session_id = ${session_id} ORDER BY verify_key DESC LIMIT 1`
                , function (error, auth_results, fields) {

                    if (error) {
                        console.log(error);

                        res.status(200).json({ 
                            success: false,
                            error: true,
                            message: "error\n\n"+error })
                    } else {
                        for (const item of response.comments.values()) {
                            if (item.user_id == user_id) {
    
                                 if (item.body == auth_results[0].verify_key) {
             
                                     keyVerify = true;
             
                                     // set user as verified
                                     db.query(
                                         `UPDATE Auth
                                         SET verified = true WHERE user_id = ${user_id} AND session_id = ${session_id} AND verify_key = ${auth_results[0].verify_key}`
                                         , function (error, results, fields) {

                                        if (error) {

                                            console.log(error);
                                            res.status(200).json({ 
                                                success: false,
                                                error: true,
                                                message: "error\n\n"+error })

                                        } else {
                                            res.status(200).json({ 
                                                success: true,
                                                error: false,
                                                message: "session id has now been verified" })
                                        }
                                     });
             
     
                                     break;
                                 }
                            }
                         }
             
                         if (!keyVerify) {
                             res.status(200).json({ 
                                 success: false,
                                 error: false,
                                 message: "verify key not found in comments of rant" })
                         }
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