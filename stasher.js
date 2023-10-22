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
        `SELECT id FROM Rants ORDER BY id DESC LIMIT 1;`
    
        , function (error, results, fields) {
            if (error) {

                console.error('error ' + error.message);

            } else {
                if (results[0]==undefined) {
                    rants.array.forEach(element => {
                        insertRant(results[0].id, element)
                    });
                    console.log('insert rants complete');
                } else {
                    console.log(results[0].id);

                    if (rants[rants.length()-1]<results[0].id) {
                        console.log("last inserted id("+results[0].id+") is greater than newest rant id ("+rants.length()-1+")")
                    } else {
                        rants.array.forEach(element => {
                            insertRant(results[0].id, element)
                        });
                        console.log('insert rants complete');
                    }
                }
            }
    });

}

function insertRant(last_inserted_id, rant) {
    if (rant.id > last_inserted_id) {

        var tags;
        rant.tags.array.forEach(tag => {
            tags+=tag;
        });
        var isImage = false;
        if (rant.url!=undefined) {
            isImage = true;
        }
      
         db.query(
            `INSERT INTO Users (id,text,score,created_time,url,width,height,num_comments,tags,edited,rt,rc,user_id,user_username,user_score,b,i,isImage) 
            VALUES (${rant.id},"${rant.text}",${rant.created_time},
            "${rant.url}",${rant.width},${rant.height},
            ${rant.num_comments},"${tags}",${rant.edited},
            ${rant.rt},${rant.rc},${rant.user_id},
            "${rant.user_username}",${rant.user_score},"${rant.b}",
            "${rant.i}",${isImage})`
            , function (error, results, fields) {
                if (error) {
                    console.log('insert rant error ' + error.message);
                }
        });
    }
}