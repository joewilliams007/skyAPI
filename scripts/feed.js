module.exports = (req, res) => {
    var { sort } = req.params;
    var { limit } = req.params;

    var db = require('./db');

    console.log("feed " + sort + " request")

    if (limit > 50) {
        limit = 50;
    }

    var query;

    switch (sort) {
        case "random":
            query = `SELECT * FROM Rants ORDER BY RAND()`
            break;
        case "recent":
            query = `SELECT * FROM Rants ORDER BY created_time DESC`
            break;
        case "top":
            query = `SELECT * FROM Rants ORDER BY score DESC`
            break;
        case "heated":
            query = `SELECT * FROM Rants WHERE score < 2 AND num_comments > 6 ORDER BY RAND()`
            break;
        default:
            query = `SELECT * FROM Rants ORDER BY RAND()`
            break;
    }

    db.query(
        query + " LIMIT " + limit

        , function (error, results, fields) {
            if (error) {

                console.error('error ' + error.message);

                res.status(200).json({
                    success: false,
                    error: true,
                    message: error.message
                })

            } else {
                results.forEach(element => {
                    if (element.tags) {
                        element.tags = element.tags.split(',');
                    }
                    element.edited = !!element.edited === 1;
                    element.user_avatar = {}
                    if (element.b=="undefined") {
                        element.b="7bc8a4"
                    }
                    element.user_avatar.b = element.b;
                    element.user_avatar.i = element.i;
                    element.text = element.text.slice(1, -1);
                });


                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    rants: results
                })
            }
        });
}
