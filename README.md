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
