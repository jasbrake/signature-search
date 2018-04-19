const pg = require('pg');

const client = new pg.Client({
  user: 'jason',
  host: 'localhost',
  database: 'snort_search',
  password: 'testpass',
  port: '5432'
});

client.connect()
  .then(() => console.log('connected to db'))
  .catch(e => console.error('db connection error', e.stack))

module.exports = client
