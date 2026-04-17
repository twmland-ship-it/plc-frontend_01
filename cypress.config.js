module.exports = {
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false,
    // Increase the default timeout to handle potentially slow loading pages
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    viewportWidth: 1440,
    viewportHeight: 900,
  },
}; 