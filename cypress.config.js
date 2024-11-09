const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://apex.oracle.com',
    watchForFileChanges: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args = launchOptions.args.map((arg) => {
            if (arg === '--headless') {
              return '--headless=new'
            }
            return arg
          })
        }
        return launchOptions
      })
    },
    env: {
      CYPRESS_CRASH_REPORTS: 0
    }
  },
});