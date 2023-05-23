var fs = require('fs');
var obj;
fs.readFile('./community.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);

  //console.log(obj.projects)

  obj.projects.forEach(element => 
    console.log(element+"ji")
  );
});