const log = require('loglevel');
const remote = require('loglevel-plugin-remote');

remote.apply(log, {
    url: basePath + jsLogger.LOG_ACTION,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    onError: function(err) {
        console.error('Failed to send log to server', err);
    },
    interval: 1000,
    timeout: 4000,
    stacktrace: {
        levels: ['error'],
        depth: 5,
        excess: 0,
    },
    format: function(log) {
        return `LOG: [${log.timestamp}] SERVER[${window.location.protocol + '//' + window.location.host}] BU[${basePath}] PATH[${window.location.pathname.replace(basePath, '')}] UA[${navigator.userAgent}] ${log.level.label.toUpperCase()}${
            log.logger ? ` (${log.logger})` : ''
        }: ${log.message}${log.stacktrace ? `\n${log.stacktrace}` : ''}`;
    },
});

// Handler pro běžné chyby
window.onerror = function(message, source, lineno, colno, error) {
    log.error(`Message: ${message}, Source: ${source}, Line: ${lineno}, Column: ${colno}, Error: ${error}`);
    return false; // To let the default handling run
};

// Handler pro chyby vzniklé v Promise
window.onunhandledrejection = function(event) {
    log.error(`Promise rejection: ${event.reason}`);
    event.preventDefault(); // To prevent the default handling of the rejection
};