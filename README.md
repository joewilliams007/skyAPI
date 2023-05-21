# skyAPI
### about
the skyAPI is a service that can be used to use features not included in the orgional devRant API. skyAPI is not intended as it's own social media, but rather as an optional add-on

## features
- [x] react to posts with emojis

## connecting to the API
note: all endpoints can be viewed in the index.js file
BASE_URL: http://stardash.de:2002/

### verifying devRant account session
to verify (tell sky server that you are the real owner of a devRant account) a session, first get a key from the server
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
