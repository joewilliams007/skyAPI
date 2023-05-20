// Main file of the sky API
// installation files: install.sh, msysql_db_structure.txt, db.js

const rateLimit = require('express-rate-limit')
const express = require("express")
var bodyParser = require('body-parser');
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(port, () => console.log("Server startet at port ", port));


// GET REQUEST

// Verifying proccess
app.get("/verify_key/:user_id/:session_id", require("./scripts/verify.js")) // Verify user id (generated key) [client should comment key under verify post and then call verify_comment request]
app.get("/verify_comment/:user_id/:session_id", require("./scripts/verify_comment.js")) // Verify comment containing verify_key (will verify session id)[after client commented key under verify_post]

// Reaction
app.get("/react_post/:user_id/:session_id/:post_id/:reaction", require("./scripts/react.js")) // react to post (Emojis only) [will delete prior set recation]

// Get post extras
app.get("/post/:post_id", require("./scripts/post.js")) // get post (Contains reactions)

// Get profile extras
app.get("/profile/:user_id", require("./scripts/profile.js")) // without authentication
app.get("/my_profile/:user_id/:session_id", require("./scripts/my_profile.js")) // with authentication profile details (such as following and blocking)

// Backup data
app.post("/backup", require("./scripts/backup.js")); // Backup following, blocked users and blocked words

process.on('uncaughtException', err => {
	console.error(err && err.stack)
});

