module.exports = (req, res) => {
    var { session_id } = req.params;
    var { user_id } = req.params;

    console.log("generating key for session "+session_id+" user: "+user_id)

    res.status(200).json({ 
        success: true,
        error: false,
        verify_key: "317283",
        message: "session id can be verified by commenting verify_key to the verify rant" })

        // insert key to session db with user_id and session_id and boolean verified
}