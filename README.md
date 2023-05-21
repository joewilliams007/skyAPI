# skyAPI
### about
the skyAPI is a service that can be used to use features not included in the orgional devRant API. skyAPI is not intended as it's own social media, but rather as an optional add-on

## features
- [x] react to posts with emojis

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
  "message: "session id has now been verified"
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
> POST BASE_URL/delete_account
> param: user_id
> param: session_id
```json
{
    "success": true,
    "error": false,
    "message": "delete success"
}
```
