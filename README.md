# cirrus-enrolle

You muss pass the following environment variable (there are no default values):

```
###### TWILIIO
- TWILIO_PHONE_NUMBER
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN

###### SERVER
- SERVER_PORT
- SERVER_URL

###### MONGOSE DATABASE
- MONGOSE_URL
- MONGOSE_PORT
- MONGOSE_DB
```


Passing the environment variables to the application:
```
$ CIRRUS_EMAIL = 'cirrus-lu@pt.lu' EMAIL_SERVER='mail.server.io' node app.js
```
or reate a `.env` file for development and put it in you root directory. Pay attention that `.env` file will not be loaded on production, arguments have to be put in the system for security reasons.
