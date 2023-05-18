module.exports = (req, res) => {
    var { user_id } = req.params;

    console.log("verify key of user: "+user_id)

    var getJSON = require('get-json')
 
    getJSON('https://devrant.com/api/devrant/rants/6608716?app=3/')
        .then(function (response) {

            var keyVerify = false;

            for (const item of response.comments.values()) {
               if (item.user_id == user_id) {
                    if (item.body == "317283") {

                        keyVerify = true;
                        res.status(200).json({ 
                            success: true,
                            error: false,
                            message: "session id has now been verified" })

                    }
               }
            }

            if (!keyVerify) {
                res.status(200).json({ 
                    success: false,
                    error: false,
                    message: "verify key not found in comments of rant" })
            }

    }).catch(function (error) {
        console.log(error);

        res.status(200).json({ 
            success: false,
            error: true,
            message: "error\n\n"+error })
    });



   

        // insert key to session db with user_id and session_id and boolean verified
}