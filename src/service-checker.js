const { readFile } = require('fs')
const { resolve } = require('path')
const { promisify } = require('util')
const { validate, prettyCheck } = require('./models/config')
const { parse } = require('url')
const { exec } = require('child_process')
const http = require('http')
const https = require('https')

const [
    readFileAsync,
    execAsync
] = [readFile, exec].map(promisify)

const configName = '../config.json'

function get(url, cbk) {
    const protocol = url.match(/^https:/) ? https.get : http.get
    return protocol(url, cbk)
}

function request(options, cbk) {
    const protocol = options.protocol === 'https:' ? https.request : http.request
    return protocol(options, cbk)
}

async function getConfig() {
    const config = await readFileAsync(resolve(__dirname, configName))
    return JSON.parse(config.toString())
}

async function checkHttpGet(check) {
    return await new Promise((resolve, reject) => get(check.value, response => {
        // consume response data to free up memory
        response.resume()
        if (response.statusCode !== (check.expected || 200)) {
            reject(`check http-get failed with status code ${response.statusCode}`)
        } else {
            resolve()
        }
    }).on('error', e => {
        reject(e)
    }))
}

async function alertWebhook(check, text) {
    const options = {
        method: 'POST',
        protocol: 'https',
        ...parse(check.alerts.webhook)
    }
    return await new Promise((resolve, reject) => {
        const req = request(options, response => {
            const { statusCode } = response
            if (statusCode !== 200) {
                reject(`webhook alert error with status code ${statusCode}`)
            } else {
                resolve()
            }
        })
        req.write(JSON.stringify({ text }))
        req.end()
    })
}

async function performAlerts(check, error) {
    const alerts = []
    if (check.alerts) {
        if (check.alerts.webhook) {
            alerts.push(alertWebhook(check, error))
        }
    }
    return await Promise.all(alerts)
}

async function performCommand(check) {
    return check.command ? await execAsync(check.command) : true
}

async function performFailureActions(check, error) {
    return await Promise.all([
        performAlerts(check, error),
        performCommand(check)
    ])
}

function perform(check) {
    console.log('perform check on', prettyCheck(check))

    switch (check.type) {
        case 'http-get':
            checkHttpGet(check)
            .catch(e => {
                const error = `${e} on ${prettyCheck(check)}`
                console.log(error)
                return performFailureActions(check, error)
            })
            .catch(e => console.log(e, 'on', prettyCheck(check)))
        break

        default:
            console.log(`check type not supported "${check.type}"`)
        break
    }
}

function performChecks(config) {
    validate(config)
    config.checks.forEach(
        check => setInterval(() => perform(check), check.interval)
    )
}

async function start() {
    const config = await getConfig()
    performChecks(config)
}

start().catch(e => console.log('service failed', '=>', e))
