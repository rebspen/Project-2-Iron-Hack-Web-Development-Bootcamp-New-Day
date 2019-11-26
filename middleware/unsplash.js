const fetch = require('node-fetch');
global.fetch = fetch;

const Unsplash = require('unsplash-js').default;

const unsplash = new Unsplash({ accessKey: process.env.APP_ACCESS_KEY});

module.exports = unsplash;