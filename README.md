# service-checker
A little service to perform some checks on a service, trigger an alert if needed, and exec a command if wanted

No dependencies at all, only pure nodejs

## required
- nodejs >= 8
- that's all

## required config
a config file is required at the root of the project service-checker/config.json
```
{
    "checks": [
        {
            "type": "http-get", //required
            "value": "https://myservice.com", //required
            "interval": "60000", //required
            "alerts": { //optional
                "webhook": "YOUR_WEBHOOK_URL"
            },
            "command": "service my-service restart" //optional
        },
        {
            "type": "http-get",
            "value": "http://myservice.com",
            "expected": 301, //optional status code expected (default 200)
            "interval": "60000",
            "alerts": {
                "webhook": "YOUR_WEBHOOK_URL"
            }
        }
    ]
}

```

currently only http-get check is available, but others will come (like http-post, exec a bash command)

## start 
`npm start` 
or pm2 to run as a deamon `pm2 start ./src/service-checker.js`

## http-get check
this check allow you to perform a GET request on a specific url and expect a status code (200 by default)

## alerts (optional)
currently only webhooks alert are supported, others will come (ex: email)

## command (optional)
execute a bash command if the check fails 

## note
`alert` and `command` are optional but you need to put at least one of them
