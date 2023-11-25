module.exports = (req, res) => {
    session_id = req.body.session_id;
    user_id = req.body.user_id;

    rant = req.body

    var text = req.body.text;

    console.log(req.body)

    var db = require('./db');
    var authenticate = require('./authenticate');

    var getJSON = require('get-json')
    var timestamp_added = Math.floor(new Date().getTime() / 1000) // in seconds

    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function (isAuthenticate) {
        // returns true or false
        if (isAuthenticate) {
            stashRant();
        }
    })

    function stashRant(rant) {

        console.log(text)

        // Use the escape function to escape and insert the text
        const escapedText = db.escape(text);

    
        if (req.body.url == "") {
            db.query(
                `INSERT INTO Rants (id,text,score,created_time,url,width,height,num_comments,tags,edited,rt,rc,user_id,user_username,user_score,b,i,isImage,user_stashed) 
                            VALUES (${req.body.rant_id},"${escapedText}",${req.body.score},${req.body.created_time},
                            null,0,0,
                            ${req.body.num_comments},"${req.body.tags}",${req.body.edited},
                            0,0,${req.body.rant_user_id},
                            "${req.body.user_username}",${req.body.user_score},"${req.body.user_avatar.b}",
                            "${req.body.user_avatar.i}",0,1)`
                , function (error, results, fields) {
                    if (error) {
                        console.log('stash error ' + error.message);
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: error.message
                        })
                    } else {
                        update_user_num_stashed()
                    }
                });
        } else {
            db.query(
                `INSERT INTO Rants (url,id,text,score,created_time,url,width,height,num_comments,tags,edited,rt,rc,user_id,user_username,user_score,b,i,isImage,user_stashed) 
                            VALUES ("${req.body.url}",${req.body.rant_id},"${escapedText}",${req.body.score},${req.body.created_time},
                            null,0,0,
                            ${req.body.num_comments},"${req.body.tags}",${req.body.edited},
                            0,0,${req.body.rant_user_id},
                            "${req.body.user_username}",${req.body.user_score},"${req.body.user_avatar.b}",
                            "${req.body.user_avatar.i}",1,1)`
                , function (error, results, fields) {
                    if (error) {
                        console.log('stash error ' + error.message);
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: error.message
                        })
                    } else {
                        update_user_num_stashed()
                    }
                });
        }

        

    }

    function update_user_num_stashed() {

        db.query(
            `UPDATE Users set
            num_stashed_rants = num_stashed_rants + 1
            WHERE user_id = ${user_id}`
            , function (error, results, fields) {
                if (error) {

                    console.log('stash successfull, update count error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })

                } else {
                    console.log('stash successfull');

                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "stash successfull. fänk u"
                    })
                }

            });
    }
}