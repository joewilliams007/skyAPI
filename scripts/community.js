module.exports = (req, res) => {
    var db = require('./db');
   
    console.log("community proejcts request")

    db.query(
        `SELECT * FROM Projects ORDER BY timestamp_added DESC`
    
        , function (error, results, fields) {
            if (error) {

                console.error('error ' + error.message);

                res.status(200).json({
                    success: false,
                    error: true,
                    message: error.message
                })

            } else {
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    projects: results
                })
            }
    });
}