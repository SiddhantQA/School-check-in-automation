// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  timeout : 50 * 1000,
  expect:{
    timeout:10000
  },

  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  
  use: {  
    trace: 'on',
    screenshot : 'on',
    browserName : 'chromium',
    headless : true,
  },

});

