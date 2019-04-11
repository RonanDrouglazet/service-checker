# service-checker
A little service to perform some checks on a service, trigger an alert if needed, and exec a command if wanted

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
                "webhook": "https://hooks.slack.com/services/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"
            },
            "command": "service my-service restart" //optional
        },
        {
            "type": "http-get",
            "value": "http://myservice.com",
            "expected": 301, //optional status code expected (default 200)
            "interval": "60000",
            "alerts": {
                "webhook": "https://hooks.slack.com/services/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"
            }
        }
    ]
}

```

currently only http-get check is available, but others will come (like exec a bash command)

## http-get check
this check allow you to perform a GET request on a specific url and expect a status code (200 by default)

## alerts (optional)
currently only webhooks alert are supported, others will come (ex: email)

## command (optional)
execute a bash command if the check fails 

## note
`alert` and `command` are optional but you need to put at least one of them
