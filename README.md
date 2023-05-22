# skyAPI
### about
the skyAPI is a service that can be used to use features not included in the official devRant API. skyAPI is not intended as it's own social media, but rather as an optional add-on
[example endpoint](http://stardash.de:2002/post/6608716)
## features
- [x] get reactions to post
- [x] react to posts with emojis
- [x] backup data following/blockedUsers/blockedWords
- [ ] chat
- [ ] profile personalisation
- [ ] [community projects API](https://github.com/joewilliams007/jsonapi) being merged
- [ ] many more to come!
## connecting to the API
- note: all endpoints can be viewed in the index.js file
- BASE_URL: http://stardash.de:2002/

### verifying devRant account session
- to (register) and verify a session (tell sky server that you are the real owner of a devRant account), first get a key from the server
- the user_id *must* be the devRant user_id while session id *should* be the devRant token id 
> GET BASE_URL/verify_key/:user_id/:session_id
```json
{
  "success": true,
  "error": false,
  "verify_key": 1684671895,
  "verify_post_id": "6608716",
  "message": "session id can be verified by commenting verify_key to the verify rant"
}
```
- then your client should comment the verify_key to the verify_post_id on devRant
- upon commenting with success, the client should call the server to check the verify_post_id post for your key
> GET BASE_URL/verify_comment/:user_id/:session_id
```json
{
  "success": true,
  "error": false,
  "message": "session id has now been verified"
}
```
- for any user_id related interactions with skyAPI, a verified session can now be used
- not verified sessions will not be able to interact as their user_id
- there can be multiple verified sessions for one account at the same time
### getting post extras
> GET BASE_URL/post/:post_id"
```json
{
  "success": true,
  "error": false,
  "message": "ok",
  "reactions": [
      {
        "reaction_id": 14,
        "user_id": 5344593,
        "post_id": 6608716,
        "reaction": "👍",
        "timestamp": 1684625364,
        "avatar": "v-37_c-3_b-5_g-m_9-1_1-1_16-6_3-3_8-2_7-2_5-2_12-1_6-3_10-5_2-91_22-9_15-3_11-4_18-4_19-3_4-2_20-6_21-2.jpg",
        "username": "joewilliams007",
        "color": "d55161"
      }
    ]
}
```
### reacting to posts with an emoji
- will delete any prior reaction user made to the post
> GET BASE_URL/react_post/:user_id/:session_id/:post_id/:reaction
```json
{
    "success": true,
    "error": false,
    "message": "reaction has been set"
}
```
### deleting account
- will delete everything associated with user_id as foreign key from Users table, such as sessions, reactions etc
> POST BASE_URL/delete_account
- param type: multipart/form-data
- param: user_id
- param: session_id
```json
{
    "success": true,
    "error": false,
    "message": "delete success"
}
```
### other endpoints
- user profile
[example profile](http://stardash.de:2002/profile/5344593)
> GET BASE_URL/profile/:user_id
- my profile
> GET BASE_URL/my_profile/:user_id/:session_id
- backup data [(example implementation skyRant)](https://github.com/joewilliams007/skyRant)
> POST BASE_URL/backup
## custom server installation
- incase one wants to host skyAPI him/herself
### creating mysql database
- creating database: mysql_db_structure.txt
- editing file to connect to your database
```bash
nano scripts/db.js
```
### installing
```bash
git clone https://github.com/joewilliams007/skyAPI
cd skyAPI
sudo bash install.sh
```
## Example Implementation
- [skyRant Android client](https://github.com/joewilliams007/skyRant)
- [watchRant wear-os client](https://github.com/joewilliams007/watchRant)
