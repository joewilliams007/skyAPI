var fs = require('fs');
var obj;
var db = require('../scripts/db');
fs.readFile('./community.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);

  //console.log(obj.projects)

  obj.projects.forEach(element => 
    db.query(
      `INSERT INTO Projects (title,os,type,timestamp_added,description,relevant_dr_url,website,github,language,active,owner) 
      VALUES ("${element.title}","${element.os}","${element.type}",${element.timestamp_added},"${element.desc}","${element.relevant_dr_url}",
      "${element.website}","${element.github}","${element.language}",${element.active},"${element.owner}")`
      , function (error, results, fields) {
          if (error) {
          
              console.log('error ' + error.message);

          } else {
              console.log("success")
          }
  })
  );
});