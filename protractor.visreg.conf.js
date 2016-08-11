/*jshint node:true */

var config = {
    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:9001',

    specs: [
        './test/visreg/*.midway.js'
    ],

    framework: 'mocha',

    snappit: {
        screenshotsDirectory: './screenshots',
        threshold: 5,
        defaultResolutions: [[768, 1024], [1024, 768]], // tablet
        cicd: {
            serviceAccount: {
                userName: 'comeatmebro',
                userEmail: 'comeatmebro@users.noreply.github.com'
            },
            screenshotsRepo: 'https://github.com/rackerlabs/encore-bridge-screenshots',
            projectRepo: 'https://github.com/rackerlabs/encore-bridge'
        }
    },

    capabilities: {
        browserName: 'firefox'
    },

    allScriptsTimeout: 30000,

    onPrepare: () => {
        browser.driver.manage().window().setSize(1366, 768); // laptop
        //expect = require('chai').use(require('chai-as-promised')).expect;
        //encore = require('./encore-ui/utils/rx-page-objects/index');
        screenshot = require('snappit-mocha-protractor');
    },

    // Options to be passed to mocha
    mochaOpts: {
        enableTimeouts: false,
        reporter: 'spec',
        slow: 5000,
        ui: 'bdd'
    },

    seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar'
};

exports.config = config;
