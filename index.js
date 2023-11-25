// Main file of the sky API
// installation files: install.sh, msysql_db_structure.txt, db.js

const rateLimit = require('express-rate-limit')
const express = require("express")
var bodyParser = require('body-parser');
const port = 2002;
const app = express();
var cors = require("cors")
var multer = require("multer");
var upload = multer({ dest: "./uploads/" });
app.use(cors())

const limiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 20 minutes
	max: 4000, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const reaction_limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 20, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const verify_limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 15, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


// Apply the rate limiting middleware to all requests
app.use(limiter)
app.use(express.json());

app.listen(port, () => console.log("Server startet at port ", port));


// GET REQUEST

// Verifying proccess
app.get("/verify_key/:user_id/:session_id",verify_limiter, require("./scripts/verify.js")) // Verify user id (generated key) [client should comment key under verify post and then call verify_comment request]
app.get("/verify_comment/:user_id/:session_id",verify_limiter, require("./scripts/verify_comment.js")) // Verify comment containing verify_key (will verify session id)[after client commented key under verify_post]

// Reaction
app.get("/react_post/:user_id/:session_id/:post_id/:reaction", reaction_limiter, require("./scripts/react.js")) // react to post (Emojis only) [will delete prior set recation]

// Get post extras
app.get("/post/:post_id", require("./scripts/post.js")) // get post (Contains reactions)

// Get profile extras
app.get("/profile/:user_id", require("./scripts/profile.js")) // without authentication
app.get("/my_profile/:user_id/:session_id", require("./scripts/my_profile.js")) // with authentication profile details (such as following and blocking)

// Get community projects
app.get("/community", require("./scripts/community.js")) // get community projects (formaly https://github.com/joewilliams007/jsonapi (same structure, use GitHub as back up))
// Upload community project
app.post("/upload_project", upload.array("file"), require("./scripts/upload_project.js")); // upload project

// Backup data
app.post("/backup", upload.array("file"), require("./scripts/backup.js")); // Backup following, blocked users and blocked words

// Set profile frame
app.post("/set_custom", upload.array("file"), require("./scripts/set_custom.js")); // set custom profile

// Delete account
app.post("/delete_account", upload.array("file"), require("./scripts/delete_account.js")); // Delete account (everything associated with foregin key user id will be deleted aswell)

// Upload Rant for stashing
app.post("/stash_rant", upload.array("file"), require("./scripts/stash_rant.js")); // stash a rant for if devRant goes down. methode for old rants opened through surprise rant

process.on('uncaughtException', err => {
	console.error(err && err.stack)
});

