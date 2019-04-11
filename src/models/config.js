const requiredCheckProperties = ['type', 'value', 'interval']
const optionalInclusiveProperties = ['alerts', 'command']

const hasOptionalProperties = check => Object.keys(check).reduce((p, c) => p || optionalInclusiveProperties.includes(c), false)
const hasRequiredProperties = check => {
    requiredCheckProperties.forEach(requiredProperty => {
        if (!check[requiredProperty]) throw `field "${requiredProperty}" not defined or empty on check ${prettyCheck(check)}`
    })
    return true
}
const hasProperties = check => {
    hasRequiredProperties(check)
    if (!hasOptionalProperties(check)) {
        throw `you need to add one of this properties: ${optionalInclusiveProperties.join(',')} in ${prettyCheck(check)}`
    }
}

exports.prettyCheck = check => JSON.stringify(check, null, 3)

exports.validate = (config) => {
    try {
        if (!config) throw 'invalid config object'
        if (!config.checks) throw 'checks array not defined'
        if (!config.checks.length) throw 'checks array empty'
        config.checks.forEach(hasProperties)
    } catch (e) {
        throw `config validation failed => ${e}`
    }
}
