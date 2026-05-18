const webpack = require('webpack');

module.exports = {
    entry: './js/js-logger/src/JsLogger.js',
    output: {
        filename: 'JsLogger.js', // název výstupního souboru
        path:  __dirname + '/js/js-logger/dist', // cesta k výstupnímu adresáři
        library: {
            name: 'JsLogger', // název knihovny
            type: 'umd', // univerzální modulový formát, který funguje jako amd, commonjs a jako globální proměnná
        },
        globalObject: 'this', // umožňuje knihovně být použitelné jak v prohlížeči, tak na serveru
    },
    mode: 'production',
};