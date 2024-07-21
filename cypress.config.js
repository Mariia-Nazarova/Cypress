const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1000,
  viewportHeight: 660,
  video: true,
  //запуск через терминал npx cypress run--browser chrome--config viewportWidth=1280,viewportHeight=720, результат будет лежать в папке е2е->videos
  e2e: {
    baseUrl: "http://localhost:3000",
    retries: 2,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
