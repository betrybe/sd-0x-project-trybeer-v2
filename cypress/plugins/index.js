// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoDbUrl = process.env.DB_URL;
const bancomongo = process.env.DB_NAME;

module.exports = (on, config) => {
  on('task', {
    deleteCollection(collection) {
      return new Promise((resolve) => {
        MongoClient.connect(mongoDbUrl, (err, client) => {
          if (err) {
            throw err;
          } else {
            const db = client.db(bancomongo);
            db.collection(collection).deleteMany({});
            resolve('');
            client.close();
          }
        })
      });
    }
  });

  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-dev-shm-usage');
      return launchOptions;
    }
    return launchOptions;
  });
}
