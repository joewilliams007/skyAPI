//  Main file of Starspace Server

const rateLimit = require('express-rate-limit')
const express = require("express")
const port = 2002;
const app = express();
var cors = require("cors")
app.use(cors())
const limiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minutes
	max: 4000, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.listen(port, () => console.log("Server startet at port ", port));
app.use(express.json())


// GET REQUEST
app.get("/verify_key/:user_id/:session_id", require("./scripts/verify.js")) // Verify user id
app.get("/verify_comment/:user_id/:session_id", require("./scripts/verify_comment.js")) // Verify comment containing verify_key

process.on('uncaughtException', err => {
	console.error(err && err.stack)
});

