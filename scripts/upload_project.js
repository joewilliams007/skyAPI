module.exports = (req, res) => {
    session_id = req.body.session_id;
    user_id = req.body.user_id;

    title = req.body.title
    os = req.body.os
    type = req.body.type
    description = req.body.description
    relevant_dr_url = req.body.relevant_dr_url
    website = req.body.website
    github = req.body.github
    language = req.body.language
    active = req.body.active
    archived = req.body.archived
    owner_user_id = req.body.owner_user_id
    owner = req.body.owner

    console.log(req.body)

    var db = require('./db');
    var authenticate = require('./authenticate');
    var getJSON = require('get-json')
    var timestamp_added = Math.floor(new Date().getTime() / 1000) // in seconds

    // Authenticate user id and password
    authenticate.isVerify(session_id, user_id, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            getUserScore();
        }
    })

    function getUserScore() {
        console.log("getting user score - fetching devRant details")
        // fetch profile details such as username, avatar, color
        getJSON('https://devrant.com/api/users/'+user_id+'?app=3/')
        .then(function (response) {
            if (response.profile.score>=500) {
                upload();
            } else {
                res.status(200).json({ 
                    success: false,
                    error: false,
                    message: "atleast 500 devRant points are needed to upload projects" })
            }
        }).catch(function (error) {
            console.log("fetching devRant error\n\n"+error);

            res.status(200).json({ 
                success: false,
                error: true,
                message: "error\n\n"+error })
        });
    }

    function upload(){

        db.query(
            `INSERT INTO Projects 
            (user_id,title,os,type,timestamp_added,description,relevant_dr_url,website,github,
            language,active,archived,owner_user_id,owner)
            VALUES (${user_id},"${title}","${os}","${type}",${timestamp_added},"${description}","${relevant_dr_url}","${website}",
            "${github}","${language}",${active},${archived},${owner_user_id},"${owner}")`
            , function (error, results, fields) {
                if (error) {
    
                    console.error('insert project error ' + error.message);
    
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })
    
                } else {
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "project has been added"
                    })
                }
        });
    }
}