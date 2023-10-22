// stash all Rants uploaded in the last 24h
// why? devRant down -> rants remain
// advanced search -> devRant API limited search
// statistics.. -> devRant doesn't publish stats anymore

var getJSON = require('get-json')
var db = require('./scripts/db');

fetchRants()

function fetchRants() {
    console.log("fetching devRant feed")
    
    getJSON('https://devrant.com/api/devrant/rants?app=3&limit=50&sort=latest&range=day&skip=0/')
    .then(function (response) {

        stash(response);

    }).catch(function (error) {
        console.log("fetching devRant error\n\n"+error);
    });
}

function stash(rants) {

    db.query(
        `SELECT LAST_INSERT_ID()`
    
        , function (error, results, fields) {
            if (error) {

                console.error('error ' + error.message);

                res.status(200).json({
                    success: false,
                    error: true,
                    message: error.message
                })

            } else {
                console.log(results[0].RowDataPacket);
            }
    });

    /*rants.forEach(element => {
            
    });
        db.query(
            `INSERT INTO Users (user_id, username, avatar, color, timestamp) 
            VALUES (${user_id},"${response.profile.username}","${response.profile.avatar_sm.i}","${response.profile.avatar_sm.b}",${timestamp})`
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
        });*/
}