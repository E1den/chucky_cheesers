const yaml = require('js-yaml');
const fs = require('fs');

//Load in SQL credential
//sql creds at
//  user        -> config.meta.credentials.user
//  password    -> config.meta.credentials.password
//  database    -> config.meta.credentials.database

//Test the timing (not the best measurement because it will very by machine)
exports.meta = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));