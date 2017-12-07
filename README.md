# cirrus-enrolle

Environment variable than can be passed, if not than defaults will be used:

- CIRRUS_EMAIL
- CIRRUS_EMAIL_PASSWORD
- EMAIL_SERVER
- EMAIL_SERVER_PORT
- EMAIL_SERVER_SSL  

Passing it to the application:
```
$ CIRRUS_EMAIL = 'cirrus-lu@pt.lu' EMAIL_SERVER='mail.server.io' node app.js
```
