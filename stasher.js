// stash all Rants uploaded in the last 24h
// why? devRant down -> rants remain
// advanced search -> devRant API limited search
// statistics.. -> devRant doesn't publish stats anymore

var getJSON = require('get-json')
var db = require('./scripts/db');
const nodeCron = require("node-cron");


fetchRants()

const job = nodeCron.schedule("30 20 * * * *", () => {
    console.log(new Date().toLocaleString());
    fetchRants()
});

job.start()


function fetchRants() {
    console.log("fetching devRant feed")
    
    getJSON('https://devrant.com/api/devrant/rants?app=3&limit=50&sort=latest&range=day&skip=0/')
    .then(function (response) {
        console.log('insert rants start');
        stash(response.rants);

        console.log('insert rants complete');
       
    }).catch(function (error) {
        console.log("fetching devRant error\n\n"+error);
    });
}

function stash(rants) {

   
    rants.forEach(element => {
        insertRant(0, element)
    }); 

    console.log('insert rants complete');
       


    /*db.query(
        `SELECT id FROM Rants ORDER BY id DESC LIMIT 1;`
    
        , function (error, results, fields) {
            if (error) {

                console.error('error ' + error.message);

            } else {
                if (results[0]==undefined) {
                    rants.forEach(element => {
                        insertRant(0, element)
                    });
                    console.log('insert rants complete');
                } else {
                    console.log(results[0].id);

                    if (rants[rants.length-1]<results[0].id) {
                        console.log("last inserted id("+results[0].id+") is greater than newest rant id ("+rants.length()-1+")")
                    } else {
                        rants.forEach(element => {
                            insertRant(results[0].id, element)
                        });
                        console.log('insert rants complete');
                    }
                }
            }
    });*/

}

function insertRant(last_inserted_id, rant) {
    if (rant.id > last_inserted_id) {

        var tags = rant.tags.toString();

         // Use the escape function to escape and insert the text
        const escapedText = db.escape(rant.text);

        if (rant.attached_image.url==undefined) {
              db.query(
                    `INSERT INTO Rants (id,text,score,created_time,url,width,height,num_comments,tags,edited,rt,rc,user_id,user_username,user_score,b,i,isImage) 
                    VALUES (${rant.id},"${escapedText}",${rant.score},${rant.created_time},
                    null,0,0,
                    ${rant.num_comments},"${tags}",${rant.edited},
                    ${rant.rt},${rant.rc},${rant.user_id},
                    "${rant.user_username}",${rant.user_score},"${rant.user_avatar.b}",
                    "${rant.user_avatar.i}",0)`
                    , function (error, results, fields) {
                        if (error) {
                            // console.log('insert rant error ' + error.message);
                        }
                });
        } else {
            db.query(
                `INSERT INTO Rants (id,text,score,created_time,url,width,height,num_comments,tags,edited,rt,rc,user_id,user_username,user_score,b,i,isImage) 
                VALUES (${rant.id},"${escapedText}",${rant.score},${rant.created_time},
                "${rant.attached_image.url}",${rant.attached_image.width},${rant.attached_image.height},
                ${rant.num_comments},"${tags}",${rant.edited},
                ${rant.rt},${rant.rc},${rant.user_id},
                "${rant.user_username}",${rant.user_score},"${rant.user_avatar.b}",
                "${rant.user_avatar.i}",1)`
                , function (error, results, fields) {
                    if (error) {
                        // console.log('insert rant image error ' + error.message);
                    }
            });
        }
    }
}